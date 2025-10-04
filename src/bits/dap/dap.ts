import { format32 } from "../../format";

export type Port = number | null

export const DebugPort: Port = null;

export const enum Action 
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

export abstract class Operation 
{
    constructor(
        readonly port: Port,
        readonly register: number,
        readonly direction: Action,
        readonly fail: (e: Error) => void
    ) {}

    protected registerName(): string 
    {
        const port = this.port == DebugPort ? "DP" : `AP${this.port}`
        return `${port}[0x${this.register.toString(16)}]`;
    }

    public abstract toString(): string;
}

export class WriteOperation extends Operation {

    constructor(
        port: Port,
        register: number,
        readonly value: Uint32Array,
        readonly done: () => void,
        fail: (e: Error) => void
    ) {
        super(port, register, Action.WRITE, fail)
    }

    override toString(): string {
        return `WRITE(${this.value.length}) ${this.registerName()} <- ${Array.from(this.value).map(format32).join(" ")}`
    }
}

export class ReadOperation extends Operation 
{
    constructor(
        port: Port,
        register: number,
        readonly count: number,
        readonly done: (op: Uint32Array) => void,
        fail: (e: Error) => void
    ) {
        super(port, register, Action.READ, fail)
    }

    override toString(): string {
        return `READ(${this.count}) ${this.registerName()}`
    }
}

export class WaitOperation extends Operation 
{
    constructor(
        port: Port,
        register: number,
        readonly mask: number,
        readonly value: number,
        readonly done: () => void,
        fail: (e: Error) => void
    ) {
        super(port, register, Action.WAIT, fail)
    }

    override toString(): string {
        return `WAIT ${this.registerName()} & ${format32(this.mask)} == ${format32(this.value)}`;
    }
}
