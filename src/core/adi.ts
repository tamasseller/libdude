import assert from 'node:assert'

import { DapAction, DapPort, DapDp } from './dap'
import { format32 } from '../format'

/**
 * As per ARM IHI 0031G (ID022122) Arm® Debug Interface Architecture Specification 
 * 
 * https://developer.arm.com/documentation/ihi0031/latest/
 */

const AdiReadOnly = [DapAction.READ, DapAction.WAIT]
const AdiWriteOnly = [DapAction.WRITE]
const AdiReadWrite = [DapAction.READ, DapAction.WAIT, DapAction.WRITE]

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

export abstract class DebugPort 
{
    public static ABORT     = new AdiRegister(DapDp, 0x00, 0x00, AdiWriteOnly)
    public static DPIDR     = new AdiRegister(DapDp, 0x00, 0x00, AdiReadOnly)
    public static CTRL_STAT = new AdiRegister(DapDp, 0x00, 0x04, AdiReadWrite)
    public static DLCR      = new AdiRegister(DapDp, 0x01, 0x04, AdiReadWrite)
    public static RESEND    = new AdiRegister(DapDp, 0x00, 0x08, AdiReadOnly)
    public static SELECT    = new AdiRegister(DapDp, 0x00, 0x08, AdiWriteOnly)
    public static RDBUFF    = new AdiRegister(DapDp, 0x00, 0x0C, AdiReadOnly)
    public static TARGETID  = new AdiRegister(DapDp, 0x02, 0x04, AdiReadOnly)
    public static DLPIDR    = new AdiRegister(DapDp, 0x03, 0x04, AdiReadOnly)
    public static EVENTSTAT = new AdiRegister(DapDp, 0x04, 0x04, AdiReadOnly)
    public static TARGETSEL = new AdiRegister(DapDp, 0x00, 0x0C, AdiWriteOnly)
}

export function accessPortIdRegister(apsel: number) 
{
    assert(apsel < 256);
    return new AdiRegister(apsel, 0x0F, 0x0C, AdiReadOnly)
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
    readonly CSW: AdiRegister
    readonly TAR: AdiRegister
    readonly DRW: AdiRegister
    readonly BD0: AdiRegister
    readonly BD1: AdiRegister
    readonly BD2: AdiRegister
    readonly BD3: AdiRegister
    readonly CFG: AdiRegister
    readonly ROM: AdiRegister
    readonly IDR: AdiRegister

    constructor(apsel: number) 
    {
        assert(apsel < 256);
        this.CSW = new AdiRegister(apsel, 0x00, 0x00, AdiReadWrite),
        this.TAR = new AdiRegister(apsel, 0x00, 0x04, AdiReadWrite),
        this.DRW = new AdiRegister(apsel, 0x00, 0x0C, AdiReadWrite),
        this.BD0 = new AdiRegister(apsel, 0x01, 0x00, AdiReadWrite),
        this.BD1 = new AdiRegister(apsel, 0x01, 0x04, AdiReadWrite),
        this.BD2 = new AdiRegister(apsel, 0x01, 0x08, AdiReadWrite),
        this.BD3 = new AdiRegister(apsel, 0x01, 0x0C, AdiReadWrite),
        this.CFG = new AdiRegister(apsel, 0x0F, 0x04, AdiReadOnly),
        this.ROM = new AdiRegister(apsel, 0x0F, 0x08, AdiReadOnly),
        this.IDR = new AdiRegister(apsel, 0x0F, 0x0C, AdiReadOnly)
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
