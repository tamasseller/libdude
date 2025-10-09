import { format32 } from '../../trace/format';
import { CommandCode, InfoRequest, CapabilityMask, HostStatusType, Protocol, ConnectResponse, Response, SwjPinMask, TransferResponse } from './protocol'

import assert from "assert";

export abstract class Command
{
    constructor(public readonly code: CommandCode) {}

    protected abstract tellRequestLength(): number;
    public requestLength() {
        return 1 + this.tellRequestLength();
    }

    protected abstract tellResponseLength(): number | undefined;
    public responseLength() {
        const len = this.tellResponseLength();
        return len == undefined ? 0 : 1 + len;
    }

    protected abstract produceRequestBytes(): Uint8Array;
    public format(): Buffer
    {
        return Buffer.concat([Uint8Array.of(this.code), this.produceRequestBytes()]);
    }

    protected abstract parseResponseBytes(data: Buffer)
    public parse(data: Buffer): number
    {
        const got = data.readUint8()

        if(got != this.code)
        {
            throw new Error(`Unexpected first byte in CMSIS-DAP response (expected: ${this.code}, got: ${got})`)
        }

        return 1 + this.parseResponseBytes(data.subarray(1))
    }

    abstract toString(): string
}

export class Capabilities
{
    swd: boolean
    jtag: boolean
    swo_uart: boolean
    swo_manchester: boolean
    atomic_commands: boolean
    test_domain_timer: boolean
    swo_streaming_trace: boolean
    uart: boolean

    toSring() {
        const ret: string[] = [];

        if(this.swd) ret.push("swd");
        if(this.jtag) ret.push("jtag");
        if(this.swo_uart) ret.push("swo/uart");
        if(this.swo_manchester) ret.push("swo/manchester");
        if(this.atomic_commands) ret.push("atomic");
        if(this.test_domain_timer) ret.push("timer");
        if(this.swo_streaming_trace) ret.push("swo/trace");  
        if(this.uart) ret.push("uart");

        return ret.join(", ")
    }
}

export type InfoResponse = 
{
    vendor?: string,
    product?: string,
    serial?: string,
    cmsisDapProtocolVersion?: string,
    productFirmwareVersion?: string,
    capabilities?: Capabilities,
    testDomainTimerFreq?: number,
    swoTraceBufferSize?: number,
    maximumPacketCount?: number,
    maximumPacketSize?: number
}

export class InfoCommand extends Command 
{
    constructor(readonly info: InfoRequest, readonly done: (resp: InfoResponse) => void) {
        super(CommandCode.INFO)
    }

    override tellRequestLength(): number {
        return 1;
    }

    override tellResponseLength(): number {
        return 63; /* Unknown actully */
    }

    override produceRequestBytes(): Uint8Array {
        return Uint8Array.of(this.info)
    }

    override parseResponseBytes(data: Buffer): number {  
        const len = data.readUint8()
    
        const readByte = (): number => {
            if(len < 1) throw new Error("Malformed CMSIS-DAP response");
            return data.readUint8(1);
        }

        const readShort = (): number => {
            if(len < 2) throw new Error("Malformed CMSIS-DAP response");
            return data.readUint16LE(1);
        }

        const readWord = (): number => {
            if(len < 4) throw new Error("Malformed CMSIS-DAP response");
            return data.readUint32LE(1);
        }

        const readString = (): string => {
            return len ? data.subarray(1, len).toString('ascii') : "";
        }

        switch(this.info)
        {
            case InfoRequest.VENDOR_ID:                this.done({vendor: readString()}); break;
            case InfoRequest.PRODUCT_ID:               this.done({product: readString()}); break;
            case InfoRequest.SERIAL_NUMBER:            this.done({serial: readString()}); break;
            case InfoRequest.CMSIS_DAP_FW_VERSION:     this.done({cmsisDapProtocolVersion: readString()}); break;
            case InfoRequest.PRODUCT_FIRMWARE_VERSION: this.done({productFirmwareVersion: readString()}); break;
            case InfoRequest.TEST_DOMAIN_TIMER:        this.done({testDomainTimerFreq: readWord()}); break;
            case InfoRequest.SWO_TRACE_BUFFER_SIZE:    this.done({swoTraceBufferSize: readWord()}); break;
            case InfoRequest.PACKET_COUNT:             this.done({maximumPacketCount: readByte()}); break;
            case InfoRequest.PACKET_SIZE:              this.done({maximumPacketSize: readByte()}); break;
            case InfoRequest.CAPABILITIES:             
                const capsByte = readByte()
                const parsedCaps = new Capabilities()
                parsedCaps.swd =                  !!(capsByte & CapabilityMask.SWD)
                parsedCaps.jtag =                 !!(capsByte & CapabilityMask.JTAG),
                parsedCaps.swo_uart =             !!(capsByte & CapabilityMask.SWO_UART),
                parsedCaps.swo_manchester =       !!(capsByte & CapabilityMask.SWO_MANCHESTER),
                parsedCaps.atomic_commands =      !!(capsByte & CapabilityMask.ATOMIC_COMMANDS),
                parsedCaps.test_domain_timer =    !!(capsByte & CapabilityMask.TEST_DOMAIN_TIMER),
                parsedCaps.swo_streaming_trace =  !!(capsByte & CapabilityMask.SWO_STREAMING_TRACE),
                parsedCaps.uart =                 !!(capsByte & CapabilityMask.UART)
                this.done({capabilities: parsedCaps}); 
                break;
        }

        return len + 1;
    }

    override toString(): string {
        return `INFO ${this.info}`;
    }
}

export class HostStatusCommand extends Command 
{
    constructor(readonly type: HostStatusType, readonly on: boolean, readonly done: () => void) {
        super(CommandCode.HOST_STATUS)
    }

    override tellRequestLength(): number {
        return 1;
    }

    override tellResponseLength(): number {
        return 1;
    }

    override produceRequestBytes(): Uint8Array {
        return Uint8Array.of(this.type, this.on ? 1 : 0)
    }

    override parseResponseBytes(data: Buffer): number {  
        if(data.readUint8() != 0) throw new Error("Malformed CMSIS-DAP response");
        this.done();
        return 1;
    }

    override toString(): string {
        return `HOST ${this.type}=${this.on}`;
    }
}

export class ConnectCommand extends Command 
{
    constructor(readonly protocol: Protocol, readonly done: (r: ConnectResponse) => void) {
        super(CommandCode.CONNECT)
    }

    override tellRequestLength(): number {
        return 1;
    }

    override tellResponseLength(): number {
        return 1;
    }

    override produceRequestBytes(): Uint8Array {
        return Uint8Array.of(this.protocol)
    }

    override parseResponseBytes(data: Buffer): number {  
        this.done(data.readUint8() as ConnectResponse);
        return 1;
    }

    override toString(): string {
        return `CONN ${this.protocol}`;
    }
}

export class DisconnectCommand extends Command 
{
    constructor(readonly done: (status: Response) => void) {
        super(CommandCode.DISCONNECT)
    }

    override tellRequestLength(): number {
        return 0;
    }

    override tellResponseLength(): number {
        return 1;
    }

    override produceRequestBytes(): Uint8Array {
        return Uint8Array.of()
    }

    override parseResponseBytes(data: Buffer): number {  
        this.done(data.readUint8());
        return 1;
    }

    override toString(): string {
        return `DISC`;
    }
}

export class WriteAbortCommand extends Command 
{
    constructor(readonly abortMask: number, readonly done: (status: Response) => void) {
        super(CommandCode.WRITE_ABORT)
    }

    override tellRequestLength(): number {
        return 2;
    }

    override tellResponseLength(): number {
        return 1;
    }

    override produceRequestBytes(): Uint8Array {
        return Uint8Array.of(0, this.abortMask)
    }

    override parseResponseBytes(data: Buffer): number {  
        this.done(data.readUint8());
        return 1;
    }

    override toString(): string {
        return `ABRT ${this.abortMask}`;
    }
}

export class DelayCommand extends Command 
{
    constructor(readonly delayUs: number, readonly done: (status: Response) => void) {
        super(CommandCode.DELAY)
    }

    override tellRequestLength(): number {
        return 2;
    }

    override tellResponseLength(): number {
        return 1;
    }

    override produceRequestBytes(): Uint8Array {
        const b = Buffer.alloc(2)
        b.writeUInt16LE(this.delayUs);
        return b;
    }

    override parseResponseBytes(data: Buffer): number {  
        this.done(data.readUint8());
        return 1;
    }

    override toString(): string {
        return `DLAY ${this.delayUs}`;
    }
}

export class ResetTargetCommand extends Command 
{
    constructor(readonly done: (status: number, executed: number) => void) {
        super(CommandCode.RESET_TARGET)
    }

    override tellRequestLength(): number {
        return 0;
    }

    override tellResponseLength(): number {
        return 2;
    }

    override produceRequestBytes(): Uint8Array {
        return Uint8Array.of()
    }

    override parseResponseBytes(data: Buffer): number {  
        this.done(data.readUint8(), data.readUint8(1));
        return 2;
    }

    override toString(): string {
        return `RSTT`;
    }
}

export class SwjPinsCommand extends Command 
{
    constructor(
        readonly output: SwjPinMask, 
        readonly select: SwjPinMask, 
        readonly wait: number, 
        readonly done: (input: SwjPinMask) => void
    ) {
        super(CommandCode.SWJ_PINS)
    }

    override tellRequestLength(): number {
        return 6;
    }

    override tellResponseLength(): number {
        return 1;
    }

    override produceRequestBytes(): Uint8Array {
        const b = Buffer.alloc(6)
        b.writeUInt8(this.output >>> 0, 0)
        b.writeUInt8(this.select >>> 0, 1)
        b.writeUint32LE(this.wait >>> 0, 2)
        return b
    }

    override parseResponseBytes(data: Buffer): number {  
        this.done(data.readUint8());
        return 1;
    }

    override toString(): string {
        return `SWJP ${this.output} ${this.select} ${this.wait}`;
    }
}

export class SwjClockCommand extends Command 
{
    constructor(readonly clockFreqHz: number, readonly done: (status: Response) => void) {
        super(CommandCode.SWJ_CLOCK)
    }

    override tellRequestLength(): number {
        return 4;
    }

    override tellResponseLength(): number {
        return 1;
    }

    override produceRequestBytes(): Uint8Array {
        const b = Buffer.alloc(4)
        b.writeUInt32LE(this.clockFreqHz >>> 0)
        return b
    }

    override parseResponseBytes(data: Buffer): number {  
        this.done(data.readUint8());
        return 1;
    }

    override toString(): string {
        return `SWJC ${this.clockFreqHz}`;
    }
}

export class SwjSequenceCommand extends Command 
{
    constructor(
        readonly bitCount: number, 
        readonly bits: Uint8Array, 
        readonly done: (input: Response) => void
    ) {
        super(CommandCode.SWJ_SEQUENCE)
        assert(bits.length == ((bitCount + 7) >> 3));
    }

    override tellRequestLength(): number {
        return 1 + this.bits.length;
    }

    override tellResponseLength(): number {
        return 1;
    }

    override produceRequestBytes(): Uint8Array {
        return Uint8Array.of(this.bitCount, ...this.bits)
    }

    override parseResponseBytes(data: Buffer): number {
        this.done(data.readUint8());
        return 1;
    }

    override toString(): string {
        return `SWSQ ${this.bitCount}`;
    }
}

export class TransferConfigureCommand extends Command 
{
    constructor(
        readonly idleCycles: number, 
        readonly waitRetry: number, 
        readonly matchRetry: number, 
        readonly done: (input: Response) => void
    ) {
        super(CommandCode.TRANSFER_CONFIGURE)
    }

    override tellRequestLength(): number {
        return 5;
    }

    override tellResponseLength(): number {
        return 1;
    }

    override produceRequestBytes(): Uint8Array {
        const b = Buffer.alloc(5)
        b.writeUInt8(this.idleCycles, 0)
        b.writeUInt16LE(this.waitRetry, 1)
        b.writeUInt16LE(this.matchRetry, 3)
        return b
    }

    override parseResponseBytes(data: Buffer): number {  
        this.done(data.readUint8());
        return 1;
    }

    override toString(): string {
        return `XCFG ${this.idleCycles} ${this.waitRetry} ${this.matchRetry}`;
    }
}

export const enum TransferOperation
{
    Write, Read, ValueMatch, MatchMask
}

function formRequestByte(op: TransferOperation, ap_nDp: boolean, address: number)
{
    return (ap_nDp ? 1 : 0)
        | ((op == TransferOperation.Read || op == TransferOperation.ValueMatch) ? 2 : 0)
        | (address & 0xc)
        | (op == TransferOperation.ValueMatch ? 16 : 0)
        | (op == TransferOperation.MatchMask ? 32 : 0);
}

export class TransferRequest
{
    private constructor(
        readonly op: TransferOperation, 
        readonly ap_nDp: boolean, 
        readonly address: number, 
        readonly done: (input: TransferResponse, data?: number) => void, 
        readonly value?: number
    ) {}

    public static read(ap_nDp: boolean, address: number, done: (input: TransferResponse, data: number) => void = () => {}): TransferRequest {
        return new TransferRequest(TransferOperation.Read, ap_nDp, address, done as (input: TransferResponse, data?: number) => void);
    }

    public static write(ap_nDp: boolean, address: number, value: number, done: (input: TransferResponse) => void = () => {}): TransferRequest {
        return new TransferRequest(TransferOperation.Write, ap_nDp, address, done as (input: TransferResponse) => void, value);
    }

    public static valueMatch(ap_nDp: boolean, address: number, value: number, done: (input: TransferResponse) => void = () => {}): TransferRequest {
        return new TransferRequest(TransferOperation.ValueMatch, ap_nDp, address, done as (input: TransferResponse) => void, value);
    }

    public static matchMask(ap_nDp: boolean, address: number, value: number, done: (input: TransferResponse) => void = () => {}): TransferRequest {
        return new TransferRequest(TransferOperation.MatchMask, ap_nDp, address, done as (input: TransferResponse) => void, value);
    }

    tellRequestLength(): number {
        return (this.op == TransferOperation.Read) ? 1 : 5
    }

    tellResponseLength(): number {
        return (this.op == TransferOperation.Read) ? 4 : 0
    }

    request(): Uint8Array {
        const req = formRequestByte(this.op, this.ap_nDp, this.address)

        if(this.op == TransferOperation.Read)
        {
            return Uint8Array.of(req)
        }
        else
        {
            const b = Buffer.alloc(5)
            b.writeUint8(req)
            b.writeUint32LE(this.value! >>> 0, 1)
            return b;
        }
    }

    parse(lastResp: number, data: Buffer): number {
        if(this.op == TransferOperation.Read)
        {
            this.done(lastResp, data.readInt32LE(0))
            return 4;
        }
        else
        {
            this.done(lastResp)
            return 0;
        }
    }

    toString(): string {
        let opStr = "";
        switch(this.op)
        {
            case TransferOperation.Read:       opStr = `.read()`; break;
            case TransferOperation.Write:      opStr = `.write(${format32(this.value! >>> 0)})`; break;
            case TransferOperation.ValueMatch: opStr = `.match(${format32(this.value! >>> 0)})`; break;
            case TransferOperation.MatchMask:  opStr = `.mask(${format32(this.value! >>> 0)})`; break;
        }
        return `${this.ap_nDp ? "AP" : "DP"}[0x${this.address.toString(16)}]${opStr}`;
    }
}

export class TransferCommand extends Command 
{
    constructor(readonly reqs: TransferRequest[]) {
        super(CommandCode.TRANSFER)
    }

    override tellRequestLength(): number {
        return 2 + this.reqs.reduce((a, r) => a + r.tellRequestLength(), 0);
    }

    override tellResponseLength(): number {
        return 2 + this.reqs.reduce((a, r) => a + r.tellResponseLength(), 0);
    }

    override produceRequestBytes(): Uint8Array {
        assert(this.reqs.length)

        return Buffer.concat([
            Uint8Array.of(0, this.reqs.length),
            ...this.reqs.map(r => r.request())
        ]);
    }

    override parseResponseBytes(data: Buffer): number 
    {
        const count = data.readUint8(0);
        const lastResp = data.readUint8(1);

        let offset = 2;
        for(let idx = 0; idx < this.reqs.length; idx++)
        {
            offset += this.reqs[idx].parse(idx < count ? TransferResponse.OK : lastResp, data.subarray(offset))
        }

        if(count != this.reqs.length) throw new Error("Incorrect transfer count in response")

        return offset;
    }

    override toString(): string {
        return `XFER ${this.reqs.map(r => r.toString()).join(", ")}`;
    }
}

export abstract class TransferBlockCommand extends Command 
{
    constructor(readonly ap_nDp: boolean, readonly address: number) {
        super(CommandCode.TRANSFER_BLOCK)
    }

    public abstract split(reqDataSpace: number, resDataSpace: number): [TransferBlockCommand | undefined, TransferBlockCommand];
}

export class WriteBlockCommand extends TransferBlockCommand 
{
    constructor(
        ap_nDp: boolean, 
        address: number, 
        readonly values: number[], 
        readonly done: (input: TransferResponse, data?: number) => void) 
    {
        super(ap_nDp, address)
    }

    override tellRequestLength(): number {
        return 4 + this.values.length * 4;
    }

    override tellResponseLength(): number {
        return 3;
    }

    override produceRequestBytes(): Uint8Array {
        assert(this.values.length)

        const b = Buffer.alloc(4 + this.values.length * 4);
        b.writeUInt8(0, 0)
        b.writeUInt16LE(this.values.length, 1)
        b.writeUInt8(formRequestByte(TransferOperation.Write, this.ap_nDp, this.address), 3)
        this.values.forEach((v, idx) => b.writeUInt32LE(v >>> 0, 4 + 4 * idx))
        return b;
    }

    override parseResponseBytes(data: Buffer): number 
    {
        const count = data.readUint16LE();
        if(count != this.values.length) throw new Error("Incorrect transfer count in response")

        this.done(data.readUInt8(2))
        return 3;
    }

    override split(reqDataSpace: number, _: number): [TransferBlockCommand | undefined, TransferBlockCommand]
    {
        const cut = reqDataSpace >> 2;
        assert(cut < this.values.length)

        return [
            cut ? new WriteBlockCommand(this.ap_nDp, this.address, this.values.slice(0, cut), () => {}) : undefined,
            new WriteBlockCommand(this.ap_nDp, this.address, this.values.slice(cut), this.done)
        ];
    }

    override toString(): string {
        return `WBLK ${this.ap_nDp ? "AP" : "DP"}[0x${this.address.toString(16)}] <- ${this.values.map(format32).join(" ")}`;
    }
}

export class ReadBlockCommand extends TransferBlockCommand 
{
    constructor(
        readonly ap_nDp: boolean,
        readonly address: number, 
        readonly count: number, 
        readonly done: (input: TransferResponse, data: number[]) => void
    ) {
        super(ap_nDp, address)
    }

    override tellRequestLength(): number {
        return 4;
    }

    override tellResponseLength(): number {
        return 3 + this.count * 4;
    }
    
    override produceRequestBytes(): Uint8Array {
        assert(this.count)
        const b = Buffer.alloc(4);
        b.writeUInt8(0)
        b.writeUInt16LE(this.count, 1)
        b.writeUInt8(formRequestByte(TransferOperation.Read, this.ap_nDp, this.address), 3)
        return b
    }

    override parseResponseBytes(data: Buffer): number 
    {
        const count = data.readUint16LE();
        if(count != this.count) throw new Error("Incorrect transfer count in response")

        let p: number[] = [];

        for(let i = 0; i < this.count; i++)
        {
            p.push(data.readUInt32LE(3 + 4 * i))
        }

        this.done(data.readUInt8(2), p)
        return 3 + 4 * count;
    }

    override split(_: number, resDataSpace: number): [TransferBlockCommand | undefined, TransferBlockCommand]
    {
        const cut = resDataSpace >> 2;
        assert(cut < this.count)

        const first: number[] = []

        return [
            cut ? new ReadBlockCommand(this.ap_nDp, this.address, cut, (_, data) => first.push(...data!)) : undefined,
            new ReadBlockCommand(this.ap_nDp, this.address, this.count - cut, (resp, data) => this.done(resp, [...first, ...data]))
        ];
    }

    override toString(): string {
        return `RBLK ${this.ap_nDp ? "AP" : "DP"}[0x${this.address.toString(16)}] #${this.count}`;
    }
}

export class TransferAbortCommand extends Command 
{
    constructor() {
        super(CommandCode.TRANSFER_ABORT)
    }

    override tellRequestLength(): number {
        return 0;
    }

    override tellResponseLength(): undefined {
        return undefined;
    }

    override produceRequestBytes(): Uint8Array {
        return Buffer.of()
    }

    override parseResponseBytes(data: Buffer): number 
    {
        return 0;
    }

    override toString(): string {
        return `XABR`;
    }
}

export class ExecuteCommands extends Command 
{
    constructor(readonly cmds: Command[]) {
        super(CommandCode.EXECUTE_COMMANDS)
    }

    override tellRequestLength(): number {
        return 1 + this.cmds.reduce((a, c) => a + c.requestLength(), 0);
    }

    override tellResponseLength(): number {
        return 1 + this.cmds.reduce((a, c) => a + c.responseLength(), 0);
    }

    override produceRequestBytes(): Uint8Array {
        return Buffer.concat([
            Buffer.of(this.cmds.length),
            ...this.cmds.map(cmd => cmd.format())
        ])
    }

    override parseResponseBytes(data: Buffer): number 
    {
        const count = data.readUint8();
        if(count != this.cmds.length) throw new Error("Incorrect command count in response")

        let offset = 1;

        for(const cmd of this.cmds)
        {
            offset += cmd.parse(data.subarray(offset))
        }

        return offset
    }

    override toString(): string {
        return `EXEC ${this.cmds.map(c => c.toString()).join("; ")}`;
    }
}
