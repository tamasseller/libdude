import assert from "assert";
import { DapAction } from "./dapOperation";
import { format32 } from "../trace/format";
import { LinkManagementOperation } from "./probe";
import { AdiExecutor, AdiOperation } from "./adiOperation";
import { coalesce } from "../core/coalesce";

export abstract class MemoryAccess 
{
    constructor(
        readonly address: number, 
        readonly action: DapAction, 
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
        super(address, DapAction.WRITE, e => 
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
        super(address, DapAction.READ, e => 
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

        super(address, DapAction.WAIT, e => 
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

export interface MemoryAccessTranslator 
{
    translate(cmds: MemoryAccess[]): AdiOperation[];
}

export interface MemoryAccessExecutor
{
    execute(ops: (LinkManagementOperation | AdiOperation | MemoryAccess)[])
}

export class MemoryAccessAdapter implements MemoryAccessExecutor
{
    constructor(readonly adapter: AdiExecutor, readonly mat: MemoryAccessTranslator) {}

    execute(ops: (LinkManagementOperation | AdiOperation | MemoryAccess)[])
    {
        this.adapter.execute(coalesce(ops, MemoryAccess, ops => this.mat.translate(ops)))
    }
}
