import assert from "assert";

import Executor, { Invocation } from "../executor";
import MemoryAccessor from "./accessor";

import range from "../../../utility/range";
import { Assignment, Block, Branch, Jump, JumpKind, Loop, Special, Statement, Store } from "../program/statement";
import { Binary, Constant, Expression, Load, Variable } from "../program/expression";
import { LoadStoreWidth } from "../program/common";
import { BinaryOperator, evaluteOperator } from "../program/binaryOperator";

export interface Observer
{
    observeEntry(): void
    observeExit(): void
    observeSpecial(s: Special): void
    observeJump(s: Jump): void
    observeLoop(s: Loop): void
    observeBranch(s: Branch, taken: boolean): void
    observeWait(addr: number, mask: number, value: number): void
    observeStore(s: Store): void
    observeAssignment(s: Assignment): void
}

class EvaluationResult
{
    constructor(readonly flushHandles: any[], readonly value: Promise<number>) {}

    static literal(value: number): EvaluationResult {
        return new EvaluationResult([], Promise.resolve(value))
    }
}

const enum BlockEscape
{
    Proceed, RestartBlock, ExitBlock, Terminate
}

interface ExecuteResult 
{
    escape: BlockEscape
    flushHandles: any[]
}

class Context
{
    readonly variables = new Map<Variable, EvaluationResult>()
    readonly overlays: Buffer[] = []

    constructor(readonly accessor: MemoryAccessor) {}

    private findOverlay(address: number): ({data: Buffer, offset: number} | undefined)
    {
        const idx = address >>> 10;
        const offset = address & 1023;
        if(idx < this.overlays.length)
        {
            if(offset < this.overlays[idx].byteLength)
            {
                return {
                    data: this.overlays[idx],
                    offset: offset
                }
            }
        }
    }

    public addOverlay(data: Buffer<ArrayBufferLike>): number 
    {
        const ret = this.overlays.length * 1024;

        this.overlays.push(
            ...range(0, (data.length + 1023) >>> 10)
                .map(i => data.subarray(i * 1024, Math.min((i + 1) * 1024, data.byteLength)))
        )
        
        return ret;
    }

    private load(address: number, width: LoadStoreWidth): EvaluationResult 
    {
        const overlay = this.findOverlay(address)
        if(overlay !== undefined)
        {
            switch(width)
            {
                case LoadStoreWidth.U1: return EvaluationResult.literal(overlay.data.readUInt8(overlay.offset))
                case LoadStoreWidth.U2: return EvaluationResult.literal(overlay.data.readUInt16LE(overlay.offset))
                case LoadStoreWidth.U4: return EvaluationResult.literal(overlay.data.readUInt32LE(overlay.offset))
            }
        }
        else
        {
            let handle: any;

            const promise = new Promise<number>((res, rej) => {
                switch(width)
                {
                    case LoadStoreWidth.U1:
                        handle = this.accessor.read(address, 1, (b) => res(b.readUInt8()), rej)
                        break

                    case LoadStoreWidth.U2:
                        handle = this.accessor.read(address, 2, (b) => res(b.readUInt16LE()), rej)
                        break

                    case LoadStoreWidth.U4:
                        handle = this.accessor.read(address, 4, (b) => res(b.readUInt32LE()), rej)
                        break
                }
            })

            return {flushHandles: [handle], value: promise}
        }
    }

    private store(address: number, value: number, width: LoadStoreWidth): any 
    {
        let b: Buffer;
        switch(width)
        {
            case LoadStoreWidth.U1:
                b = Buffer.alloc(1)
                b.writeUInt8(value)
                break

            case LoadStoreWidth.U2:
                b = Buffer.alloc(2)
                b.writeUInt16LE(value)
                break

            case LoadStoreWidth.U4:
                b = Buffer.alloc(4)
                b.writeUInt32LE(value)
                break
        }

        return this.accessor.write(address, b, () => {}, e => {throw e})
    }

    flush(handles: any[]): void {
        this.accessor.flush(handles)
    }

    set(variable: Variable, value: EvaluationResult): void {
        this.variables.set(variable, value)
    }

    get(variable: Variable): EvaluationResult
    {
        if(this.variables.has(variable))
        {
            return this.variables.get(variable)!
        }
        else
        {
            throw new Error("Runtime error: tried to read unset variable")
        }
    }

    walkConstant(e: Constant): EvaluationResult {
        return EvaluationResult.literal(e.value)
    }

    walkVariable(e: Variable): EvaluationResult {
        return this.get(e)
    }

    async walkLoad(e: Load): Promise<EvaluationResult> {
        return this.load((await this.evaluate(e.address)), e.width)
    }

    async walkBinary(e: Binary): Promise<EvaluationResult> 
    {
        const [lval, rval] = await Promise.all([
            this.walkExpression(e.left),
            this.walkExpression(e.right)
        ]) ;

        return new EvaluationResult([...lval.flushHandles, ...rval.flushHandles],
            Promise.all([lval.value, rval.value]).then(arr => 
                evaluteOperator(e.operator, arr[0], arr[1]))
        )
    }

    async walkExpression(e: Expression): Promise<EvaluationResult>
    {
        if(e instanceof Constant)
        {
            return this.walkConstant(e)
        }
        else if(e instanceof Variable)
        {
            return this.walkVariable(e)
        }
        else if(e instanceof Load)
        {
            return this.walkLoad(e)
        }
        else
        {
            assert(e instanceof Binary)
            return this.walkBinary(e)
        }
    }

    async evaluate(e: Expression): Promise<number>
    {
        const res = await this.walkExpression(e)

        if(res.flushHandles.length)
        {
            this.flush(res.flushHandles)
        }

        return await res.value
    }

    async executeBlock(s: Block, observer: Observer | undefined): Promise<ExecuteResult>
    {
        const handles: any[] = []

        for(const stmt of s.stmts)
        {
            const result = await this.execute(stmt, observer)
            handles.push(...result.flushHandles)

            if(result.escape != BlockEscape.Proceed)
            {
                return {
                    flushHandles: handles, 
                    escape: result.escape
                }
            }
        }

        return {flushHandles: handles, escape: BlockEscape.Proceed};
    }

    async executeAssignment(s: Assignment, observer: Observer | undefined): Promise<ExecuteResult>
    {
        observer?.observeAssignment(s)

        this.set(s.target, await this.walkExpression(s.value));
        
        return {flushHandles: [], escape: BlockEscape.Proceed};
    }

    async executeStore(s: Store, observer: Observer | undefined): Promise<ExecuteResult>
    {
        observer?.observeStore(s)

        const lval = await this.evaluate(s.address)
        const rval = await this.evaluate(s.value)

        return {escape: BlockEscape.Proceed, flushHandles: [
            this.store(lval, rval, s.width)
        ]};
    }

    async executeBranch(s: Branch, observer: Observer | undefined): Promise<ExecuteResult>
    {
        const cond = await this.evaluate(s.condition)
        const take = cond != 0

        observer?.observeBranch(s, take)

        if(take)
        {
            observer?.observeEntry()
            const res = await this.execute(s.then, observer);
            observer?.observeExit()
            return res;
        } 
        else if(s.otherwise)
        {
            observer?.observeEntry()
            const res = await this.execute(s.otherwise, observer);
            observer?.observeExit()
            return res;
        }

        return {flushHandles: [], escape: BlockEscape.Proceed};
    }

    static hasLoad(e: Expression): boolean
    {
        if(e instanceof Load)
        {
            return true;
        }
        else if(e instanceof Binary)
        {
            return Context.hasLoad(e.left) || Context.hasLoad(e.right);
        }

        return false;
    }

    async executeWait(addr: Expression, mask: Expression, value: Expression, observer: Observer | undefined): Promise<ExecuteResult>
    {
        const ares = await this.walkExpression(addr)
        const mres = await this.walkExpression(mask)
        const vres = await this.walkExpression(value)

        this.flush([...ares.flushHandles, ...mres.flushHandles, ...vres.flushHandles])
        const [a, m, v] = await Promise.all([ares.value, mres.value, vres.value])

        observer?.observeWait(a, m, v)

        return {
            escape: BlockEscape.Proceed,
            flushHandles: [this.accessor.wait(a, m, v, () => {}, e => {throw e})]
        }
    }

    tryFitWait(s: Loop, observer: Observer | undefined): Promise<ExecuteResult> | undefined
    {
        const isConstant = (e: Expression) => !Context.hasLoad(e)
        const isConstLoad = (e: Expression) => e instanceof Load && isConstant(e.address)
        const isMaskedLoad = (e: Expression) => 
            e instanceof Binary 
            && e.operator == BinaryOperator.BitAnd
            && ((  isConstLoad(e.left) && isConstant(e.right))
                || isConstLoad(e.right) && isConstant(e.left))

        const isMaskedLoadCheck = (e: Expression) => 
            e instanceof Binary 
            && e.operator == BinaryOperator.Ne
            && ((  isMaskedLoad(e.left) && isConstant(e.right))
                || isMaskedLoad(e.right) && isConstant(e.left))

        const isEmptyBlock = (e: Statement) => 
            e instanceof Block && e.stmts.length === 0

        if(!isEmptyBlock(s.body) || !isMaskedLoadCheck(s.preCondition))
        {
            return undefined
        }

        const cond = s.preCondition as Binary
        const [addrMask, value] = isMaskedLoad(cond.left) 
            ? [cond.left, cond.right] 
            : [cond.right, cond.left]

        const am = addrMask as Binary
        const [load, mask] = isConstLoad(am.left)
            ? [am.left, am.right]
            : [am.right, am.left]
        
        const addr = (load as Load).address
        return this.executeWait(addr, mask, value, observer)
    }

    async executeLoop(s: Loop, observer: Observer | undefined): Promise<ExecuteResult>
    {
        const handles: any[] = []

        const ret = this.tryFitWait(s, observer)
        if(ret !== undefined) return ret
        
        observer?.observeLoop(s)

        while(true)
        {
            const cond = await this.evaluate(s.preCondition)
            if(cond == 0)
            {
                break;
            }

            observer?.observeEntry()
            const result = await this.execute(s.body, observer);
            observer?.observeExit()

            handles.push(...result.flushHandles)

            if(result.escape == BlockEscape.ExitBlock)
            {
                break;
            } 
            else if(result.escape == BlockEscape.Terminate)
            {
                return {flushHandles: handles, escape: BlockEscape.Terminate};
            }
        }

        return {flushHandles: handles, escape: BlockEscape.Proceed};
    }

    async executeJump(s: Jump, observer: Observer | undefined): Promise<ExecuteResult>
    {
        observer?.observeJump(s)

        switch(s.kind)
        {
            case JumpKind.Break: return {flushHandles: [], escape: BlockEscape.ExitBlock}
            case JumpKind.Continue: return {flushHandles: [], escape: BlockEscape.RestartBlock}
            case JumpKind.Return: return {flushHandles: [], escape: BlockEscape.Terminate}
        }
    }

    async executeSpecial(s: Special, observer: Observer | undefined): Promise<ExecuteResult>
    {
        observer?.observeSpecial(s)

        return {
            escape: BlockEscape.Proceed,
            flushHandles: [this.accessor.special(s.param)]
        }
    }

    async execute(s: Statement, observer: Observer | undefined): Promise<ExecuteResult>
    {
        if(s instanceof Block)
        {
            return this.executeBlock(s, observer)
        }
        else if(s instanceof Assignment)
        {
            return this.executeAssignment(s, observer)
        }
        else if(s instanceof Store)
        {
            return this.executeStore(s, observer)
        }
        else if(s instanceof Branch)
        {
            return this.executeBranch(s, observer)
        }
        else if(s instanceof Loop)
        {
            return this.executeLoop(s, observer)
        }
        else if(s instanceof Special)
        {
            return this.executeSpecial(s, observer)
        }
        else
        {
            assert(s instanceof Jump)
            return this.executeJump(s, observer)
        }
    }

    public async run(root: Block, observer: Observer | undefined): Promise<any[]>
    {
        const result = await this.executeBlock(root, observer);
        assert([BlockEscape.Proceed, BlockEscape.Terminate].includes(result.escape))

        return result.flushHandles
    }
}

export default class Interpreter extends Executor
{
    readonly accessor: MemoryAccessor
    readonly observerBuilder?: (args: Variable[], retvals: Variable[]) => Observer;

    constructor(accessor: MemoryAccessor, observerBuilder?: (args: Variable[], retvals: Variable[]) => Observer)
    {
        super();
        this.accessor = accessor
        this.observerBuilder = observerBuilder
    }

    async runMultiple(...invocations: Invocation[]): Promise<number[][]>
    {
        const fvals: any[] = []
        const ret: Promise<number[]>[] = []

        for(const {procedure: p, args} of invocations)
        {
            if(args.length !== p.args.length)
            {
                throw new Error(`Runtime error: expected ${p.args.length} arguments, got ${args.length}`)
            }

            const ctx = new Context(this.accessor);

            p.args.forEach((v, idx) => {
                const arg = typeof args[idx] === "number"
                    ? args[idx]
                    : ctx.addOverlay(args[idx]);

                ctx.set(v, EvaluationResult.literal(arg))
            });

            const observer = this.observerBuilder?.(p.args, p.retvals)
            fvals.push(...await ctx.run(p.body, observer))
            
            const rv = p.retvals.map(v => ctx.get(v))
            fvals.push(...rv.map(v => v.flushHandles).flat());
            ret.push(Promise.all(rv.map(v => v.value)))
        }

        this.accessor.flush(fvals)
        return Promise.all(ret)
    }
}
