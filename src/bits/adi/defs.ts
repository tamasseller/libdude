import assert from 'node:assert'

import * as dapDef from '../dap/dap'
import * as adiOps from './operations'
import * as Operation from "./operations"

/**
 * As per ARM IHI 0031G (ID022122) Arm® Debug Interface Architecture Specification 
 * 
 * https://developer.arm.com/documentation/ihi0031/latest/
 */

const ReadOnly = [dapDef.Action.READ, dapDef.Action.WAIT]
const WriteOnly = [dapDef.Action.WRITE]
const ReadWrite = [dapDef.Action.READ, dapDef.Action.WAIT, dapDef.Action.WRITE]

export class Register
{
    constructor(
        readonly port: dapDef.Port, 
        readonly bank: number, 
        readonly address: number, 
        readonly access: dapDef.Action[]
    ) {}

    writeMultiple(data: Uint32Array, done: () => void = () => {}, fail: (e: Error) => void): adiOps.Operation {
        assert(this.access.includes(dapDef.Action.WRITE));
        return new Operation.WriteOperation(this, data, done, fail);
    }

    write(data: number, done: () => void = () => {}, fail: (e: Error) => void): adiOps.Operation {
        return this.writeMultiple(Uint32Array.from([data]), done, fail)
    }

    readMultiple(length: number, done: (data: Uint32Array) => void, fail: (e: Error) => void): adiOps.Operation {
        assert(this.access.includes(dapDef.Action.READ));
        return new Operation.ReadOperation(this, length, done, fail);
    }

    read(done: (data: number) => void, fail: (e: Error) => void): adiOps.Operation {
        return this.readMultiple(1, (v: Uint32Array) => done(v[0]), fail);
    }

    wait(mask: number, value: number, done: () => void = () => {}, fail: (e: Error) => void): adiOps.Operation {
        assert(this.access.includes(dapDef.Action.WAIT));
        return new Operation.WaitOperation(this, mask, value, done, fail);
    }

    toString(access: dapDef.Action): string {
        const list = this.port == dapDef.DebugPort ? DebugPort : new MemoryAccessPort(0);
        const port = this.port == dapDef.DebugPort ? "DP" : `AP${this.port}`;
        
        const reg = Object.entries(list).find(kv => 
            kv[1].bank == this.bank && 
            kv[1].address == this.address && 
            kv[1].access.includes(access)
        )?.[0] ?? "<???>";

        return `${port}.${reg}`;
    }
}

export abstract class DebugPort 
{
    public static ABORT     = new Register(dapDef.DebugPort, 0x00, 0x00, WriteOnly)
    public static DPIDR     = new Register(dapDef.DebugPort, 0x00, 0x00, ReadOnly)
    public static CTRL_STAT = new Register(dapDef.DebugPort, 0x00, 0x04, ReadWrite)
    public static DLCR      = new Register(dapDef.DebugPort, 0x01, 0x04, ReadWrite)
    public static RESEND    = new Register(dapDef.DebugPort, 0x00, 0x08, ReadOnly)
    public static SELECT    = new Register(dapDef.DebugPort, 0x00, 0x08, WriteOnly)
    public static RDBUFF    = new Register(dapDef.DebugPort, 0x00, 0x0C, ReadOnly)
    public static TARGETID  = new Register(dapDef.DebugPort, 0x02, 0x04, ReadOnly)
    public static DLPIDR    = new Register(dapDef.DebugPort, 0x03, 0x04, ReadOnly)
    public static EVENTSTAT = new Register(dapDef.DebugPort, 0x04, 0x04, ReadOnly)
    public static TARGETSEL = new Register(dapDef.DebugPort, 0x00, 0x0C, WriteOnly)
}

export function accessPortIdRegister(apsel: number) 
{
    assert(apsel < 256);
    return new Register(apsel, 0x0F, 0x0C, ReadOnly)
}

export interface AccessPortIdRegisterValue
{
    revision: number,
    designer: number,
    class: number,
    variant: number,
    type: number
}

export const enum ApClass
{
    JTAG = 0b0000,
    COM  = 0b0001,
    MEM  = 0b1000
}

export const enum MemApType
{
    AHB3       = 0x1,
    APB2_APB3  = 0x2,
    AXI3_AXI4  = 0x4,
    AHB5       = 0x5,
    APB4_APB5  = 0x6,
    AXI5       = 0x7,
    AHB5_HPROT = 0x8
}

export function parseIdr(raw: number): AccessPortIdRegisterValue
{
    return {
        revision: (raw & 0xf000_0000) >>> 28,
        designer: (raw & 0x0ffe_0000) >>> 17,
        class:    (raw & 0x0001_e000) >>> 13,
        variant:  (raw & 0x0000_00f0) >>> 4,
        type:     (raw & 0x0000_000f) >>> 0
    }
}

export class MemoryAccessPort
{
    readonly CSW: Register
    readonly TAR: Register
    readonly DRW: Register
    readonly BD0: Register
    readonly BD1: Register
    readonly BD2: Register
    readonly BD3: Register
    readonly CFG: Register
    readonly ROM: Register
    readonly IDR: Register

    constructor(apsel: number) 
    {
        assert(apsel < 256);
        this.CSW = new Register(apsel, 0x00, 0x00, ReadWrite),
        this.TAR = new Register(apsel, 0x00, 0x04, ReadWrite),
        this.DRW = new Register(apsel, 0x00, 0x0C, ReadWrite),
        this.BD0 = new Register(apsel, 0x01, 0x00, ReadWrite),
        this.BD1 = new Register(apsel, 0x01, 0x04, ReadWrite),
        this.BD2 = new Register(apsel, 0x01, 0x08, ReadWrite),
        this.BD3 = new Register(apsel, 0x01, 0x0C, ReadWrite),
        this.CFG = new Register(apsel, 0x0F, 0x04, ReadOnly),
        this.ROM = new Register(apsel, 0x0F, 0x08, ReadOnly),
        this.IDR = new Register(apsel, 0x0F, 0x0C, ReadOnly)
    }
}

export const enum AbortMask {
    DAPABORT = (1 << 0),
    STKCMPCLR = (1 << 1),
    STKERRCLR = (1 << 2),
    WDERRCLR = (1 << 3),
    ORUNERRCLR = (1 << 4)
}

export const enum CtrlStatMask {
    ORUNDETECT = (1 << 0),
    STICKYORUN = (1 << 1),
    STICKYCMP = (1 << 4),
    STICKYERR = (1 << 5),
    READOK = (1 << 6),
    WDATAERR = (1 << 7),
    CDBGRSTREQ = (1 << 26),
    CDBGRSTACK = (1 << 27),
    CDBGPWRUPREQ = (1 << 28),
    CDBGPWRUPACK = (1 << 29),
    CSYSPWRUPREQ = (1 << 30),
    CSYSPWRUPACK = (1 << 31)
}

export const enum CSWMask {
    SIZE_8 = (0 << 0),
    SIZE_16 = (1 << 0),
    SIZE_32 = (1 << 1),
    ADDRINC_SINGLE = (1 << 4),
    ADDRINC_PACKED = (1 << 5),
    DBGSTATUS = (1 << 6),
    TRANSINPROG = (1 << 7),
    RESERVED = (1 << 24),
    HPROT1 = (1 << 25),
    MASTERTYPE = (1 << 29),
    VALUE = ( ADDRINC_SINGLE | DBGSTATUS | RESERVED | HPROT1 | MASTERTYPE ),
    VALUE_NO_INC = ( DBGSTATUS | RESERVED | HPROT1 | MASTERTYPE ),
}

export const enum EventStatMask {
    EA = 0x01
}

export interface Idcode
{
    raw: number

    // The meaning of this field is implementation defined.
    revision: number

    // Part Number for the DP. This value is provided by the designer of the DP
    partNum: number

    // MINDP functions implemented: if true Transaction counter, Pushed-verify, and Pushed-find operations are not implemented.
    minimalImplementation: boolean

    // Version of the DP architecture: 1 -> DPv1, 2 -> DPv2
    dpVersion: number   

    // Manufacturer (designer) ID in Jedec JEP106 brainfuck format (0x43b for ARM)
    designerId: number
}

export function parseIdcode(v: number): Idcode
{
    return {
        revision:              (v & 0xf000_0000) >>> 28,
        partNum:               (v & 0x0ff0_0000) >>> 20,
        minimalImplementation: (v & 0x0001_0000) !== 0,
        dpVersion:             (v & 0x0000_f000) >>> 12,
        designerId:            (v & 0x0000_0fff) >>> 0,
        raw: v
    }
}

export function parseBase(rom: number): number | undefined 
{
    const properFormat = rom & 2;
    const romTablePresent = properFormat ? (rom & 1) : rom !== 0xffffffff;
    
    if(romTablePresent)
    {
        return (rom & 0xffff_f000) >>> 0;
    }
}
