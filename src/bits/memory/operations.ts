import assert from "assert";
import * as dap from "../dap/dap";
import { format32 } from "../../format";

export abstract class MemoryAccess 
{
    constructor(
        readonly address: number, 
        readonly action: dap.Action, 
        readonly fail: (e: Error) => void
    ) {
        assert(0 <= address && address <= 4294967295);
    }

    abstract getWordBoundaries(): [number, number] | undefined;
    abstract getLength(): number | undefined;
}

export class WriteMemory extends MemoryAccess 
{
    constructor(
        address: number, 
        readonly values: Buffer,
        readonly done: () => void = () => { }, 
        reject: (e: Error) => void
    ) {
        super(address, dap.Action.WRITE, e => 
        {
            const valStr = [...this.values.values()].map(n => `00${n.toString(16)}`.slice(-2)).join(" ")
            reject(new Error(`Memory write operation at ${format32(address)} failed with value [${valStr}]`, { cause: e }));
        });
    }

    override getWordBoundaries(): [number, number] | undefined {
        if (this.values.length == 4 && (this.address & 3) == 0) {
            return [this.address, this.address + 4];
        }
    }

    override getLength(): number {
        return this.values.byteLength
    }
}

export class ReadMemory extends MemoryAccess 
{
    constructor(
        address: number, 
        readonly length: number,
        readonly done: (v: Buffer) => void = () => { }, 
        reject: (e: Error) => void
    ) {
        super(address, dap.Action.READ, e => 
        {
            return reject(new Error(`Memory read operation at ${format32(address)} of length ${this.length} failed`, { cause: e }));
        });
    }

    override getWordBoundaries(): [number, number] | undefined {
        if (this.length == 4 && (this.address & 3) == 0) {
            return [this.address, this.address + 4];
        }
    }

    override getLength(): number {
        return this.length
    }
}

export class WaitMemory extends MemoryAccess 
{
    constructor(
        address: number, 
        readonly mask: number,
        readonly value: number, 
        readonly done: () => void = () => { }, 
        reject: (e: Error) => void
    ) {
        assert((address & 3) == 0);
        assert((value & ~mask) == 0);

        super(address, dap.Action.WAIT, e => 
        {
            return reject(new Error(`Wait for word value of ${format32(value)} with mask ${format32(mask)} operation at ${format32(address)} failed`, { cause: e }));
        });
    }

    override getWordBoundaries(): [number, number] {
        return [this.address, this.address + 4];
    }

    override getLength(): undefined {
        return undefined
    }
}

export function write8(address: number, value: number, done: () => void = () => { }, fail: (e: Error) => void): WriteMemory {
    assert(0 <= value && value <= 0xff);

    return new WriteMemory(address, Buffer.of(value), done, fail);
}

export function read8(address: number, done: (v: number) => void = () => { }, fail: (e: Error) => void): ReadMemory {
    return new ReadMemory(address, 1, v => done(v.readUInt8()), fail);
}

export function write16(address: number, value: number, done: () => void = () => { }, fail: (e: Error) => void): WriteMemory {
    assert(0 <= value && value <= 0xffff);
    assert(0 == (address & 1));

    const b = Buffer.alloc(2);
    b.writeUInt16LE(value);
    return new WriteMemory(address, b, done, fail);
}

export function read16(address: number, done: (v: number) => void = () => { }, fail: (e: Error) => void): ReadMemory {
    return new ReadMemory(address, 2, v => done(v.readUInt16LE()), fail);
}

export function write32(address: number, value: number, done: () => void = () => { }, fail: (e: Error) => void): WriteMemory {
    assert(0 <= value && value <= 4294967295);
    assert(0 == (address & 3));

    const b = Buffer.alloc(4);
    b.writeUInt32LE(value >>> 0);
    return new WriteMemory(address, b, done, fail);
}

export function read32(address: number, done: (v: number) => void = () => { }, fail: (e: Error) => void): ReadMemory {
    return new ReadMemory(address, 4, v => done(v.readUInt32LE()), fail);
}
