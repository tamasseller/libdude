import { format32 } from "../format";

export type DapPort = number | null

export const DapDp: DapPort = null;

export const enum DapAction 
{
    WRITE, READ, WAIT
}

export const enum DapError 
{
    Wait = 'WAIT',
    Fault = 'FAULT',
    NoAck = 'NO_ACK',
    ProtocolError = 'PROTOCOL_ERROR',
    ValueMismatch = 'VALUE_MISMATCH'
}

export abstract class DapOperation 
{
    constructor(
        readonly port: DapPort,
        readonly register: number,
        readonly direction: DapAction,
        readonly fail: (e: Error) => void
    ) {}

    protected registerName(): string 
    {
        const port = this.port == DapDp ? "DP" : `AP${this.port}`
        return `${port}[0x${this.register.toString(16)}]`;
    }

    public abstract toString(): string;
}

export class DapWrite extends DapOperation {

    constructor(
        port: DapPort,
        register: number,
        readonly value: Uint32Array,
        readonly done: () => void,
        fail: (e: Error) => void
    ) {
        super(port, register, DapAction.WRITE, fail)
    }

    override toString(): string {
        return `WRITE(${this.value.length}) ${this.registerName()} <- ${Array.from(this.value).map(format32).join(" ")}`
    }
}

export class DapRead extends DapOperation 
{
    constructor(
        port: DapPort,
        register: number,
        readonly count: number,
        readonly done: (op: Uint32Array) => void,
        fail: (e: Error) => void
    ) {
        super(port, register, DapAction.READ, fail)
    }

    override toString(): string {
        return `READ(${this.count}) ${this.registerName()}`
    }
}

export class DapWait extends DapOperation 
{
    constructor(
        port: DapPort,
        register: number,
        readonly mask: number,
        readonly value: number,
        readonly done: () => void,
        fail: (e: Error) => void
    ) {
        super(port, register, DapAction.WAIT, fail)
    }

    override toString(): string {
        return `WAIT ${this.registerName()} & ${format32(this.mask)} == ${format32(this.value)}`;
    }
}
