import { Special, Jump, Loop, Branch, Expression, Store, Assignment, JumpKind, Variable, Constant, Load, Binary, operatorToString, LoadStoreWidth, operatorPrecedence } from "../program/procedure";
import { Observer } from "./intepreter";

import { format32 } from "../../../utility/io"
import assert from "assert";

export class DebugObserver implements Observer
{
    private readonly varNames = new Map<Variable, string>()
    private indent = 0
    private varCounter = 0

    constructor(private readonly log: (msg: string) => void, args: Variable[], retvals: Variable[]) 
    {
        args.forEach((v, idx) => this.varNames.set(v, `a${idx}`))
        retvals.forEach((v, idx) => this.varNames.set(v, `r${idx}`))
    }

    private get i() : string {
        return "--".repeat(this.indent) + "-> "
    }

    observeEntry(): void {
        this.indent++
    }

    observeExit(): void {
        this.indent--
    }

    private name(v: Variable) : string {
        const known = this.varNames.get(v);
        if(known) return known

        const name = `v${this.varCounter++}`;
        this.varNames.set(v, name);
        return name
    }

    private static loadStoreWidthToString(w: LoadStoreWidth): string
    {
        switch(w)
        {
            case LoadStoreWidth.U1: return ", 1"
            case LoadStoreWidth.U2: return ", 2"
            default:
                assert(w == LoadStoreWidth.U4)
                return ""
        }
    }

    private stringify(value: Expression, parentPrecedence: number = 0, isAddr: boolean = false): string
    {
        if(value instanceof Variable)
        {
            return this.name(value)
        }
        else if(value instanceof Constant)
        {
            if(isAddr)
            {
                return `${format32(value.value)}`
            }
            else if(value.value < 32)
            {
                return `${value.value}`
            }
            else {
                return `${value.value >>> 0}<${format32(value.value)}>`
            }
        }
        else if(value instanceof Load)
        {
            return `[${this.stringify(value.address, 0, true)}${DebugObserver.loadStoreWidthToString(value.width)}]`
        }
        else 
        {
            assert(value instanceof Binary)
            const prec = operatorPrecedence(value.operator)
            const needParen = prec < parentPrecedence
            const o = needParen ? '(' : ''
            const l = this.stringify(value.left, prec)
            const op = operatorToString(value.operator)
            const r = this.stringify(value.right, prec)
            const c = needParen ? ')' : ''
            return `${o}${l} ${op} ${r}${c}`
        }
    }

    observeAssignment(s: Assignment): void {
        this.log(`${this.i}${this.name(s.target)} := ${this.stringify(s.value)}`)
    }

    observeStore(s: Store): void {
        this.log(`${this.i}[${this.stringify(s.address, 0, true)}${DebugObserver.loadStoreWidthToString(s.width)}] `
            + `:= ${this.stringify(s.value)}`)
    }

    observeWait(addr: number, mask: number, value: number): void {
        this.log(`${this.i}wait [${format32(addr)}] & ${format32(mask)} == ${format32(value)}`)
    }

    observeLoop(s: Loop): void {
        this.log(`${this.i}while ${this.stringify(s.preCondition)}`)
    }

    observeBranch(s: Branch, taken: boolean): void {
        this.log(`${this.i}if ${this.stringify(s.condition)} // ${taken ? "true" : "nope"}`)
    }

    observeSpecial(s: Special): void {
        this.log(`${this.i}sPecIAl ${s.param}`)
    }

    observeJump(s: Jump): void {
        switch(s.kind)
        {
            case JumpKind.Break:
                this.log(`${this.i}break`)
                break
            case JumpKind.Continue:
                this.log(`${this.i}continue`)
                break
            case JumpKind.Return:
                this.log(`${this.i}return`)
                break
        }
    }
}