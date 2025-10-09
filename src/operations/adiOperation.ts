import assert from "assert";
import { DapAction, DapDp, DapPort } from "./dapOperation";
import { DebugPort, MemoryAccessPort } from "../data/adiRegisters";
import { format32 } from "../trace/format";
import { LinkManagementOperation, Probe, TransferOperation } from "./probe";
import { Pager } from "../core/pager";
import { coalesce } from "../core/coalesce";

export const AdiReadOnly = [DapAction.READ, DapAction.WAIT]
export const AdiWriteOnly = [DapAction.WRITE]
export const AdiReadWrite = [DapAction.READ, DapAction.WAIT, DapAction.WRITE]

export class AdiRegister
{
    constructor(
        readonly port: DapPort, 
        readonly bank: number, 
        readonly address: number, 
        readonly access: DapAction[]
    ) {}

    writeMultiple(data: Uint32Array, done: () => void = () => {}, fail: (e: Error) => void): AdiOperation {
        assert(this.access.includes(DapAction.WRITE));
        return new AdiWrite(this, data, done, fail);
    }

    write(data: number, done: () => void = () => {}, fail: (e: Error) => void): AdiOperation {
        return this.writeMultiple(Uint32Array.from([data]), done, fail)
    }

    readMultiple(length: number, done: (data: Uint32Array) => void, fail: (e: Error) => void): AdiOperation {
        assert(this.access.includes(DapAction.READ));
        return new AdiRead(this, length, done, fail);
    }

    read(done: (data: number) => void, fail: (e: Error) => void): AdiOperation {
        return this.readMultiple(1, (v: Uint32Array) => done(v[0]), fail);
    }

    wait(mask: number, value: number, done: () => void = () => {}, fail: (e: Error) => void): AdiOperation {
        assert(this.access.includes(DapAction.WAIT));
        return new AdiWait(this, mask, value, done, fail);
    }

    toString(access: DapAction): string {
        const list = this.port == DapDp ? DebugPort : new MemoryAccessPort(0);
        const port = this.port == DapDp ? "DP" : `AP${this.port}`;
        
        const reg = Object.entries(list).find(kv => 
            kv[1].bank == this.bank && 
            kv[1].address == this.address && 
            kv[1].access.includes(access)
        )?.[0] ?? "<???>";

        return `${port}.${reg}`;
    }
}

export abstract class AdiOperation 
{
    constructor(
        readonly register: AdiRegister, 
        readonly direction: DapAction, 
        readonly fail: (e: Error) => void
    ) {}
}

export class AdiWrite extends AdiOperation 
{
    constructor(
        register: AdiRegister, 
        readonly value: Uint32Array, 
        readonly done: () => void, 
        fail: (e: Error) => void
    ) {
        super(register, DapAction.WRITE, fail);
    }

    public toString(): string {
        return `WRITE(${this.value.length}) ${this.register.toString(this.direction)} <- ${Array.from(this.value).map(format32).join(" ")}`;
    }
}

export class AdiRead extends AdiOperation {
    constructor(
        register: AdiRegister, 
        readonly count: number, 
        readonly done: (v: Uint32Array) => void, 
        fail: (e: Error) => void
    ) {
        super(register, DapAction.READ, fail);
    }

    public toString(): string {
        return `READ(${this.count}) ${this.register.toString(this.direction)}`;
    }
}

export class AdiWait extends AdiOperation {
    constructor(
        register: AdiRegister, 
        readonly mask: number, 
        readonly value: number, 
        readonly done: () => void, 
        fail: (e: Error) => void
    ) {
        super(register, DapAction.WAIT, fail);
    }

    public toString(): string {
        return `WAIT ${this.register.toString(this.direction)} & ${format32(this.mask)} == ${format32(this.value)}`;
    }
}

export interface AdiExecutor 
{
    execute(ops: (LinkManagementOperation | AdiOperation)[]): void
}

export class AdiOperationAdapter implements AdiExecutor
{
    private pager: Pager = new Pager

    constructor(readonly probe: Probe) {}

    execute(ops: (LinkManagementOperation | AdiOperation)[]): void
    {
        this.probe.execute(coalesce(ops, AdiOperation, aops => [new TransferOperation(this.pager.toDap(aops))]))
    }
}
