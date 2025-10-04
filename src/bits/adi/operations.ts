import { format32 } from "../../format";
import * as dap from "../dap/dap";
import { Register } from "./defs";

export abstract class Operation 
{
    constructor(
        readonly register: Register, 
        readonly direction: dap.Action, 
        readonly fail: (e: Error) => void
    ) {}
}

export class WriteOperation extends Operation 
{
    constructor(
        register: Register, 
        readonly value: Uint32Array, 
        readonly done: () => void, 
        fail: (e: Error) => void
    ) {
        super(register, dap.Action.WRITE, fail);
    }

    public toString(): string {
        return `WRITE(${this.value.length}) ${this.register.toString(this.direction)} <- ${Array.from(this.value).map(format32).join(" ")}`;
    }
}

export class ReadOperation extends Operation {
    constructor(
        register: Register, 
        readonly count: number, 
        readonly done: (v: Uint32Array) => void, 
        fail: (e: Error) => void
    ) {
        super(register, dap.Action.READ, fail);
    }

    public toString(): string {
        return `READ(${this.count}) ${this.register.toString(this.direction)}`;
    }
}

export class WaitOperation extends Operation {
    constructor(
        register: Register, 
        readonly mask: number, 
        readonly value: number, 
        readonly done: () => void, 
        fail: (e: Error) => void
    ) {
        super(register, dap.Action.WAIT, fail);
    }

    public toString(): string {
        return `WAIT ${this.register.toString(this.direction)} & ${format32(this.mask)} == ${format32(this.value)}`;
    }
}
