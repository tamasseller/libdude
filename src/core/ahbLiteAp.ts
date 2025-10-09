import assert from "node:assert";

import { DapAction } from '../operations/dapOperation'
import { CSWMask, MemoryAccessPort } from "../data/adiRegisters";
import { AdiRegister, AdiOperation } from "../operations/adiOperation";
import { MemoryAccess, MemoryAccessTranslator, ReadMemory, WaitMemory, WriteMemory } from "../operations/memoryAccess";

export interface MemoryAccessObserver 
{
    observeWritten(address: number, data: Buffer): void;
    observeRead(address: number, data: Buffer): void;
    observeWaited(address: number, mask: number, value: number): void;
}

const enum AccessWidth
{
    Byte, HalfWord, Word
}

function getCswValue(mode: AccessWidth, increment: boolean) 
{
    const bloat = CSWMask.DBGSTATUS | CSWMask.RESERVED | CSWMask.HPROT1 | CSWMask.MASTERTYPE

    switch(mode)
    {
        case AccessWidth.Byte:        return bloat | CSWMask.SIZE_8 | (increment ? CSWMask.ADDRINC_SINGLE : 0)
        case AccessWidth.HalfWord:    return bloat | CSWMask.SIZE_16 | (increment ? CSWMask.ADDRINC_SINGLE : 0)
        case AccessWidth.Word:        return bloat | CSWMask.SIZE_32 | (increment ? CSWMask.ADDRINC_SINGLE : 0)
    }
}

interface AccessSetup
{
    address: number, 
    mode: AccessWidth, 
    increment?: boolean
}

export class AhbLiteAp implements MemoryAccessTranslator
{
    readonly map: MemoryAccessPort;
    private readonly bankedDataRegisters: [AdiRegister, AdiRegister, AdiRegister, AdiRegister];

    private tar?: number
    private csw?: number

    constructor(apsel: number, readonly observer?: MemoryAccessObserver) {
        this.map = new MemoryAccessPort(apsel);
        this.bankedDataRegisters = [
            this.map.BD0,
            this.map.BD1,
            this.map.BD2,
            this.map.BD3
        ]
    }

    private trackSequentialAccess(count: number = 1)
    {
        assert(this.tar !== undefined && this.csw !== undefined)

        if(this.csw & CSWMask.ADDRINC_SINGLE)
        {
            const size = this.csw & 3;

            if(size == CSWMask.SIZE_8)
            {
                this.tar += count;
            }
            else if(size == CSWMask.SIZE_16)
            {
                this.tar += count * 2;
            }
            else
            {
                assert(size == CSWMask.SIZE_32)
                this.tar += count * 4;
            }
        }
    }

    private applySetup(setup: AccessSetup, fail: (e: Error) => void, trackCount?: number): AdiOperation[]
    {
        const ret: AdiOperation[] = [];

        if(this.tar !== setup.address)
        {
            ret.push(this.map.TAR.write(setup.address, undefined, fail))
            this.tar = setup.address
        }

        const currentlyIncrements = !!((this.csw ?? 0) & CSWMask.ADDRINC_SINGLE);
        const cswExp = getCswValue(setup.mode, setup.increment ?? currentlyIncrements)

        if(this.csw !== cswExp)
        {
            // Prefer increment off even if not requested if there is an update anyway
            const cswSet = getCswValue(setup.mode, setup.increment ?? false)
            ret.push(this.map.CSW.write(cswSet, undefined, fail))
            this.csw = cswSet
        }

        if(trackCount)
        {
            this.trackSequentialAccess(trackCount)
        }

        return ret;
    }

    private static alignSequencer(
        start: number, 
        end: number, 
        access8: (address: number, offset: number, last: boolean) => AdiOperation[], 
        access16: (address: number, offset: number, last: boolean) => AdiOperation[], 
        accessBlock: (address: number, offset: number, count: number, last: boolean) => AdiOperation[]
    ): AdiOperation[]
    {
        const ret: AdiOperation[] = [];
        let p = start;

        if (p & 1) 
        {
            const np = p + 1

            if(np <= end)
            {
                ret.push(...access8(p, p - start, np == end))
                p = np
            }
        }
        
        if (p & 2) {
            const np = p + 2

            if(np <= end)
            {
                assert((p & 1) == 0)
                ret.push(...access16(p, p - start, np == end))
                p = np
            }

        }

        {     
            const endAligned = end & 3;
            const np = end - endAligned;
            if(p < np)
            {
                assert((p & 3) == 0)
                ret.push(...accessBlock(p, p - start, (np - p) >> 2, np == end))
                p = np
            }
        }

        {
            const np = p + 2
            if(np <= end)
            {
                assert((p & 3) == 0)
                ret.push(...access16(p, p - start, np == end))
                p = np
            }
        }

        {
            const np = p + 1
            if(np <= end)
            {
                assert((p & 1) == 0)
                ret.push(...access8(p, p - start, np == end))
                p = np
            }
        }

        assert(p == end);
        return ret;
    }
    
    private static toLane(v: number, address: number): number
    {
        return v << ((address & 0x03) << 3);
    }

    private static fromLane(v: number, address: number)
    {
        return v >> ((address & 0x03) << 3);
    }

    private mapSequential(cmd: MemoryAccess): AdiOperation[]
    {
        switch(cmd.action)
        {
            case DapAction.WRITE:
            {
                const w = cmd as WriteMemory

                const done = this.observer 
                    ? () => {this.observer?.observeWritten(w.address, w.values); w.done()}
                    : w.done

                return AhbLiteAp.alignSequencer(
                    w.address, 
                    w.address + w.values.length,
                    (addr, offs, last) => [
                        ...this.applySetup({
                            address: addr, 
                            mode: AccessWidth.Byte, 
                            ...(last ? {} : {increment: true})
                        }, cmd.fail, 1),
                        this.map.DRW.write(
                            AhbLiteAp.toLane(w.values.readUInt8(offs), addr), 
                            last ? done : undefined, 
                            cmd.fail
                        )
                    ],
                    (addr, offs, last) => [
                        ...this.applySetup({
                            address: addr, 
                            mode: AccessWidth.HalfWord,
                            ...(last ? {} : {increment: true})
                        }, cmd.fail, 1),
                        this.map.DRW.write(
                            AhbLiteAp.toLane(w.values.readUInt16LE(offs), addr), 
                            last ? done : undefined, 
                            cmd.fail
                        )
                    ],
                    (addr, offs, count, last) => [
                        ...this.applySetup({ 
                            address: addr, 
                            mode: AccessWidth.Word,
                            ...((last && count == 1) ? {} : {increment: true})
                            }, cmd.fail, count),
                        this.map.DRW.writeMultiple(
                            Uint32Array.from({ length: count }, (_, n) => w.values.readUInt32LE(offs + 4 * n)),
                            last ? done : undefined,
                            cmd.fail)
                    ]
                )
            }

            case DapAction.READ:
            {
                const r = cmd as ReadMemory
                const buff = Buffer.alloc(r.length)

                const done = this.observer 
                    ? (v) => {this.observer?.observeRead(r.address, v); r.done(v)}
                    : r.done

                return AhbLiteAp.alignSequencer(
                    r.address, 
                    r.address + r.length,
                    (addr, offs, last) => [
                        ...this.applySetup({
                            address: addr, 
                            mode: AccessWidth.Byte, 
                            ...(last ? {} : {increment: true})
                        }, cmd.fail, 1),
                        this.map.DRW.read(
                            v => {
                                buff.writeUInt8(AhbLiteAp.fromLane(v, addr) & 0xff, offs)
                                if(last) done(buff)
                            },
                            cmd.fail
                        )
                    ],
                    (addr, offs, last) => [
                        ...this.applySetup({
                            address: addr, 
                            mode: AccessWidth.HalfWord,
                            ...(last ? {} : {increment: true})
                        }, cmd.fail, 1),
                        this.map.DRW.read(
                            v => {
                                buff.writeUInt16LE(AhbLiteAp.fromLane(v, addr) & 0xffff, offs)
                                if(last) done(buff)
                            },
                            cmd.fail
                        )
                    ],
                    (addr, offs, count, last) => [
                        ...this.applySetup({ 
                            address: addr, 
                            mode: AccessWidth.Word,
                            ...((last && count == 1) ? {} : {increment: true})
                            }, cmd.fail, count),
                        this.map.DRW.readMultiple(
                            count,
                            v => {
                                v.forEach((x, idx) => buff.writeUInt32LE(x >>> 0, offs + 4 * idx));
                                if (last) done(buff);
                            },
                            cmd.fail
                        )
                    ]
                )
            }
            
            case DapAction.WAIT:
            {
                const a = cmd as WaitMemory

                const done = this.observer 
                    ? () => {this.observer?.observeWaited(a.address, a.mask, a.value); a.done()}
                    : a.done

                return [
                    ...this.applySetup({address: cmd.address, mode: AccessWidth.Word, increment: false}, cmd.fail),
                    this.map.DRW.wait(a.mask, a.value, done, a.fail)
                ]
            }
        }
    }

    static findRandomMappablePrefix(cmds: MemoryAccess[]): [number, [number, number]] | undefined
    {
        if(cmds.length)
        {
            let range = cmds[0].getWordBoundaries()

            if(range !== undefined)
            {
                let j = 1
                while(j < cmds.length)
                {
                    const r = cmds[j].getWordBoundaries();
                    if(r === undefined)
                    {
                        break;
                    }
                
                    const nRange = [Math.min(range![0], r[0]), Math.max(range![1], r[1])]
                    if(16 < nRange[1] - nRange[0])
                    {
                        break;
                    }

                    range = nRange as [number, number];
                    j++;
                }

                return [j, range!]
            }
        }
    }

    private mapRandom(range: [number, number], cmds: MemoryAccess[]): AdiOperation[]
    {
        const base = 
            (this.tar !== undefined 
                && (this.tar & 3) == 0 
                && this.tar <= range[0]
                && range[1] <= this.tar + 16) 
                    ? this.tar 
                    : range[0]

        assert((base & 3) == 0)
        assert(cmds.length)

        return [
            ...this.applySetup({address: base, mode: AccessWidth.Word}, cmds[0].fail),
            ...cmds.map(cmd => {
                assert((cmd.address & 3) == 0)
                const first = (cmd.address - base) >> 2;
                assert(first < 4)

                switch(cmd.action)
                {
                    case DapAction.WRITE:
                    {
                        const w = cmd as WriteMemory
                        const done = this.observer 
                            ? () => {this.observer?.observeWritten(w.address, w.values); w.done()}
                            : w.done

                        assert((w.values.length & 3) == 0)
                        const count = w.values.length >> 2

                        assert(first + count <= 4)
                        return this.bankedDataRegisters.slice(first, first + count).map(
                            (reg, offs) => reg.write(
                                w.values.readUInt32LE(4 * offs), 
                                (offs == count - 1) ? done : undefined,
                                cmd.fail
                            )
                        )
                    }

                    case DapAction.READ:
                    {
                        const r = cmd as ReadMemory
                        const done = this.observer 
                            ? (v: Buffer) => {this.observer?.observeRead(r.address, v); r.done(v)}
                            : r.done

                        assert((r.length & 3) == 0)
                        const count = r.length >> 2

                        assert(first + count <= 4)
                        const b = Buffer.alloc(4 * count)
                        return this.bankedDataRegisters.slice(first, first + count).map(
                            (reg, offs) => reg.read(
                                d => {
                                    b.writeUInt32LE(d >>> 0, 4 * offs)
                                    if(offs == count - 1) done(b)
                                },
                                cmd.fail
                            )
                        )
                    }
                    
                    case DapAction.WAIT:
                    {
                        const a = cmd as WaitMemory

                        const done = this.observer 
                            ? () => {this.observer?.observeWaited(a.address, a.mask, a.value); a.done()}
                            : a.done

                        return [this.bankedDataRegisters[first].wait(a.mask, a.value, done, cmd.fail)]
                    }
                }
            }).flat()
        ];
    }

    private static formSequentialGroups([first, ...rest]: MemoryAccess[]): MemoryAccess[][]
    {
        return rest.reduce<MemoryAccess[][]>((a: MemoryAccess[][], n: MemoryAccess) => 
        { 
            const {length: x, [x - 1]: lastGroup} = a;
            assert(lastGroup.length)
            
            const {length: y, [y - 1]: last} = lastGroup;
            assert(last)

            const lastLen = last.getLength();
            if(lastLen)
            {
                const lastEnd = lastLen + last.address

                if(n.action == last.action && n.address == lastEnd)
                {
                    a[a.length - 1].push(n)
                    return a;
                }
            }

            return [...a, [n]]
        }, [[first]]);
    }

    private static coalesceSequential(cmds: MemoryAccess[]): MemoryAccess[]
    {   
        return AhbLiteAp.formSequentialGroups(cmds).map(g =>
        {
            assert(g.length)
            if(g.length == 1) return g[0]

            if(g[0] instanceof WriteMemory)
            {

                return new WriteMemory(
                    g[0].address,
                    Buffer.concat((g as WriteMemory[]).map(x => x.values)),
                    () => (g as WriteMemory[]).forEach(x => x.done()),
                    (e: Error) => (g).forEach(x => x.fail(e)),
                )
            }
            else if(g[0] instanceof ReadMemory)
            {
                return new ReadMemory(
                    g[0].address,
                    ((g as ReadMemory[]).map(x => x.length)).reduce((a, b) => a + b),
                    (d: Buffer) => (g as ReadMemory[]).reduce((o, x) => {
                        const end = o + x.length
                        x.done(d.subarray(o, end));
                        return end
                    }, 0),
                    (e: Error) => (g).forEach(x => x.fail(e)),
                )
            }
            else
            {
                assert(g[0] instanceof WaitMemory)
                assert(g.length == 1)
                return g[0];
            }
        })
    }

    public translate(rawCmds: MemoryAccess[]): AdiOperation[]
    {
        const ret: AdiOperation[] = []

        const cmds = AhbLiteAp.coalesceSequential(rawCmds);

        for(let i = 0; i < cmds.length;)
        {
            const pref = AhbLiteAp.findRandomMappablePrefix(cmds.slice(i))

            if(pref)
            {
                const [end, range] = pref

                if(range[0] + 4 < range[1] && 3 <= end)
                {
                    ret.push(...this.mapRandom(range, cmds.slice(i, i + end)))
                    i += end
                    continue
                }
            }

            ret.push(...this.mapSequential(cmds[i++]))
        }

        return ret;
    }
}