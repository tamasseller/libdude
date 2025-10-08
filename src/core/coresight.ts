import assert from 'assert';


import {Jep106_Manufacturer} from '../data/jep106'
import { MemoryAccess, ReadMemory } from './ahbLiteAp';

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

function consolidateCidrPidr(raw: Uint32Array): Uint32Array
{
    assert((raw.length & 0x3) == 0);

    const lastBytes = Buffer.from(raw);
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

export function parseBasicRomInfo(data: Uint32Array): BasicRomInfo | undefined
{
    const [pidrh, pidrl, cidr] = consolidateCidrPidr(data)
    const cidClass = parseCidr(cidr);
    
    if (cidClass == CidrClass.RomTable || cidClass == CidrClass.DebugComponent) 
    {
        return {
            class: cidClass,
            pid: parsePidr(pidrh, pidrl)
        };
    }
}

