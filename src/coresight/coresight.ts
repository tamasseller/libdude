import assert from 'assert';

import * as MemoryAccess from "../memory/operations";

import {Jep106_Manufacturer} from './jep106'

export const enum CidrClass
{
	RomTable = 0x1,         /* ROM Table, std. layout (ADIv5 Chapter 14) */
	DebugComponent = 0x9,   /* Debug component, std. layout (CoreSight Arch. Spec.) */
}

export function parseCidr(raw: number): CidrClass | undefined
{
    const PREAMBLE_MASK  = 0xffff_0fff;
    const CLASS_MASK     = 0x0000_f000;
    const PREAMBLE_VALUE = 0xb105_000d;
    const CLASS_SHIFT    = 12;

    if(((raw & PREAMBLE_MASK) >>> 0) == PREAMBLE_VALUE)
    {
        return (raw & CLASS_MASK) >>> CLASS_SHIFT;
    }
}

export interface PidrValue
{
    designer: Jep106_Manufacturer
    revision: number
    part: number
}

export function parsePidr(pidrh: number, pidrl: number): PidrValue
{
    const PIDRL_REV_OFFSET         = 20
    const PIDRL_REV_MASK           = 0xfff << PIDRL_REV_OFFSET
    const PIDRL_JEP106_CODE_OFFSET = 12                                         
    const PIDRL_JEP106_CODE_MASK   = 0x7f << PIDRL_JEP106_CODE_OFFSET
    const PIDRL_PN_MASK            = 0xfff

    const PIDRH_JEP106_CONT_MASK   = 0xf

    return {
        designer: ((pidrh & PIDRH_JEP106_CONT_MASK) << 8)
                | ((pidrl & PIDRL_JEP106_CODE_MASK) >> PIDRL_JEP106_CODE_OFFSET),
        revision: (pidrl & PIDRL_REV_MASK) >> PIDRL_REV_OFFSET,
        part: pidrl & PIDRL_PN_MASK,
    }
}


export interface MemoryReader
{
    read(address: number, length: number): Promise<Buffer>
};

function consolidateCidrPidr(raw: Buffer): Uint32Array
{
    assert((raw.length & 0xf) == 0);

    const lastBytes = Buffer.alloc(raw.length >> 2);
    for(let i = 0; i < raw.length; i += 4)
    {
        lastBytes.writeUInt8(raw.readUInt8(i), i >> 2);
    }

    const ret = new Uint32Array(lastBytes.length >> 2);
    for(let i = 0; i < lastBytes.length; i += 4)
    {
        ret[i >> 2] = lastBytes.readUInt32LE(i);
    }

    return ret;
}

export interface BasicRomInfo
{
    class: CidrClass, 
    pid: PidrValue
}

export function readCidrPidr(
    base: number, 
    done: (info?: BasicRomInfo) => void, 
    fail: (e: Error) => void): MemoryAccess.MemoryAccess
{
    return new MemoryAccess.ReadMemory((base + 0xfd0) >>> 0, 48, data => {
        const [pidrh, pidrl, cidr] = consolidateCidrPidr(data)
        const cidClass = parseCidr(cidr);
        
        if (cidClass == CidrClass.RomTable || cidClass == CidrClass.DebugComponent) 
        {
            done({
                class: cidClass,
                pid: parsePidr(pidrh, pidrl)
            })
        }

        done(undefined)
    }, fail);
}

export function readSysmem(
    base: number,
    cidClass: CidrClass,
    done: (sysmem?: boolean) => void, 
    fail: (e: Error) => void): MemoryAccess.MemoryAccess
{
    return cidClass == CidrClass.RomTable 
        ? new MemoryAccess.ReadMemory((base + 0xfcc) >>> 0, 4, data => done((data.readUInt32LE() & 1) == 1), fail)
        : new MemoryAccess.ReadMemory((base + 0xfc8) >>> 0, 4, data => done((data.readUInt32LE() & 0x10) == 0x10), fail)
}
