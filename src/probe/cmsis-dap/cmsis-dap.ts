
import { TransferResponse, InfoRequest, Response, Protocol, ConnectResponse, HostStatusType, SwjPinMask } from "./protocol"

import { packetize } from './packetize';
import { Command, InfoCommand, TransferCommand, TransferRequest, WriteBlockCommand, ReadBlockCommand, DisconnectCommand, SwjClockCommand, TransferConfigureCommand, ConnectCommand, SwjSequenceCommand, HostStatusCommand, DelayCommand, SwjPinsCommand } from './command'

import { Device, Interface, InEndpoint, OutEndpoint } from 'usb'

import assert from 'assert';
import { promisify } from 'util';
import { DapAction, DapDp, DapError, DapRead, DapWait, DapWrite } from "../../operations/dapOperation";
import { bytes, format16 } from "../../trace/format";
import { Log } from "../../trace/log";
import { ProbeDriver } from "../driver";
import { DelayOperation, LinkDriverSetupOperation, LinkDriverShutdownOperation, LinkTargetConnectOperation, Probe, ProbeOperation, ResetLineOperation, TransferOperation, UiOperation } from "../../operations/probe";

export const DEFAULT_CLOCK_FREQUENCY = 10000000;

const GET_REPORT = 0x01;
const SET_REPORT = 0x09;
const OUT_REPORT = 0x200;
const IN_REPORT = 0x100;

function convertTransferResponse(resp: TransferResponse)
{
    const ret: DapError[] = [];
    if(resp & TransferResponse.PROTOCOL_ERROR)
    {
        ret.push(DapError.ProtocolError)
    }

    if(resp & TransferResponse.VALUE_MISMATCH)
    {
        ret.push(DapError.ValueMismatch)
    }

    switch(resp & 7)
    {
        case TransferResponse.WAIT:
            ret.push(DapError.Wait)
            break

        case TransferResponse.FAULT:
            ret.push(DapError.Fault)
            break

        case TransferResponse.NO_ACK:
            ret.push(DapError.NoAck)
            break
    }

    return ret;
}

export class CmsisDap implements Probe
{
    static driver = new ProbeDriver("CMSIS-DAP", [{vid: 0xc251, pid: 0xf001}], async (log: Log, dev: Device) => {
        return new CmsisDap(log, dev);
    })

    private interface: Interface
    private inEp: InEndpoint
    private outEp: OutEndpoint

    private description: string;
    private reattachKernelDriver: boolean = false;

    private maxPacketSize: number = 64
    private hasAtomic: boolean = false

    constructor(readonly log: Log, private readonly usbDev: Device) {}
    
    pktCounter = 0;
    protected sendPacket(p: Command): void 
    {
        const data = Buffer.alloc(64)
        const fmtd = p.format();
        data.set(fmtd);
        
        const id = ("00" + (this.pktCounter++ % 100)).slice(-2)

        this.log.dbg(`${id} SEND ${p.toString()} -> ${bytes(fmtd)}`)
        this.outEp.transferAsync(data).catch(exception => {
            this.log.err(exception)
        })
        .then(() => this.inEp.transferAsync(64))
        .catch(exception => {
            this.log.err(exception)
        })
        .then(buffer => {
            this.log.dbg(`${id} RECV ${p.toString()} <- ${bytes(buffer!.subarray(0, p.responseLength()))}`)
            p.parse(buffer as Buffer);
        })
    }

    async start(): Promise<string>
    {
        const idxs = [
            this.usbDev.deviceDescriptor.iManufacturer, 
            this.usbDev.deviceDescriptor.iProduct, 
            this.usbDev.deviceDescriptor.iSerialNumber
        ];

        const fetch = promisify(this.usbDev.getStringDescriptor)
        const names: string[] = await Promise.all(idxs.map(x => fetch(x).then(s => s ?? "???")));

        this.description = `${format16(this.usbDev.deviceDescriptor.idVendor)}:${format16(this.usbDev.deviceDescriptor.idProduct)} `
            + names.join(" ") 
            + ` (bus: ${this.usbDev.busNumber}`
            + ` port(s): ${this.usbDev.portNumbers.join("/")}`
            + ` address: ${this.usbDev.deviceAddress})`

        const interfaces = this.usbDev.interfaces?.filter(iface => iface.descriptor.bInterfaceClass === 3);

        if (!interfaces?.length) {
            throw new Error('No valid interfaces found.');
        }

        const iface = interfaces.find(iface => iface.endpoints.length >= 2);
        if(!iface) throw new Error("💩")

        if (iface.isKernelDriverActive()) {
            this.log.dbg("Detaching kernel driver")
            iface.detachKernelDriver();
            this.reattachKernelDriver = true;
        }

        this.interface = iface;
        this.interface.claim()

        this.inEp = iface.endpoints.find(ep => ep.direction == 'in')! as InEndpoint
        this.inEp.timeout = 5000;
        this.outEp = iface.endpoints.find(ep => ep.direction == 'out')! as OutEndpoint
        this.outEp.timeout = 5000;

        return new Promise<string>(resolve => {
            let str = this.description;

            this.sendPacket(new InfoCommand(InfoRequest.CMSIS_DAP_FW_VERSION, resp => 
                str += ` cmsis-dap-version: ${resp.cmsisDapProtocolVersion}`
            ))

            this.sendPacket(new InfoCommand(InfoRequest.CAPABILITIES, resp => {
                str += ` capabilities: [${resp.capabilities!.toSring()}]`
                this.hasAtomic = resp.capabilities!.atomic_commands;
            }))

            this.sendPacket(new InfoCommand(InfoRequest.PACKET_SIZE, resp =>  {
                this.maxPacketSize = resp.maximumPacketSize!
                str += ` packet-size: ${resp.maximumPacketSize}`
                resolve(str)
            }))
        })
    }
    
    execute(ops: ProbeOperation[]): void 
    {
        const cmds: Command[] = []
        
        ops.forEach(top => {
            if(top instanceof TransferOperation)
            {
                top.ops.map(o => {
                    switch(o.direction)
                    {
                        case DapAction.WRITE:
                        {
                            const w = o as DapWrite;
                            assert(w.value.length)
                            let cmd: Command | undefined;

                            const done = (resp: TransferResponse): void => {
                                if(resp != TransferResponse.OK)
                                {
                                    o.fail(new Error(
                                        `Write operation ${w.toString()} implemented via ${cmd} resulted in error (code: ${resp})`, 
                                        {cause: convertTransferResponse(resp)}
                                    ))
                                }
                                else
                                {
                                    w.done()
                                }
                            }

                            cmd = (w.value.length == 1) 
                                ? (new TransferCommand([
                                    TransferRequest.write(
                                        o.port != DapDp,
                                        o.register, 
                                        w.value[0],
                                        done
                                )]))
                                : new WriteBlockCommand(
                                    o.port != DapDp, 
                                    o.register, 
                                    Array.of(...w.value), 
                                    done
                                )

                            cmds.push(cmd)
                            break;
                        }

                        case DapAction.READ:
                        {
                            const r = o as DapRead;
                            assert(r.count)
                            let cmd: Command | undefined;

                            const done = (resp: TransferResponse, data: Uint32Array): void => {
                                if(resp != TransferResponse.OK)
                                {
                                    o.fail(new Error(
                                        `Read operation ${r.toString()} implemented via ${cmd} resulted in error (code: ${resp})`, 
                                        {cause: convertTransferResponse(resp)}
                                    ))
                                }
                                else
                                {
                                    r.done(data)
                                }
                            }

                            cmd = (r.count == 1)
                                ? new TransferCommand([
                                    TransferRequest.read(
                                        o.port != DapDp, o.register, (resp, data) => done(resp, Uint32Array.of(data))
                                    )    
                                ])
                                : new ReadBlockCommand(
                                    o.port != DapDp, o.register,  r.count, (resp, data) => done(resp, Uint32Array.of(...data))
                                )

                            cmds.push(cmd)
                            break;
                        }

                        case DapAction.WAIT:
                        {
                            const a = o as DapWait;
                            const setMask = TransferRequest.matchMask(o.port != DapDp, o.register, a.mask, resp => {
                                if(resp != TransferResponse.OK)
                                {
                                    o.fail(new Error(
                                        `Setup phase of wait operation ${a.toString()} implemented via ${setMask} resulted in error (code: ${resp})`, 
                                        {cause: convertTransferResponse(resp)}
                                    ))
                                }
                            })

                            const matchValue = TransferRequest.valueMatch(o.port != DapDp, o.register, a.value, resp => {
                                if(resp != TransferResponse.OK)
                                {
                                    o.fail(new Error(
                                        `Match phase of wait operation ${a.toString()} implemented via ${matchValue} resulted in error (code: ${resp})`, 
                                        {cause: convertTransferResponse(resp)}
                                    ))
                                }
                                else
                                {
                                    a.done()
                                }
                            })

                            cmds.push(new TransferCommand([setMask, matchValue]));
                            break;
                        }
                    }
                })
            }
            else if(top instanceof LinkDriverSetupOperation)
            {
                cmds.push(
                    /* Clean up potential previous state */
                    new DisconnectCommand(r => { 
                        if (r != Response.OK) top.fail(new Error(`Disconnect failed`, { cause: r })) 
                    }),

                    /* Set up SWD link */
                    new SwjClockCommand(top.opts.frequency ?? DEFAULT_CLOCK_FREQUENCY, r => { 
                        if (r != Response.OK)  top.fail(new Error(`SwjClock failed`, { cause: r })) 
                    }),
                    
                    new TransferConfigureCommand(top.opts.idleCycles ?? 8, 32768, 32768, r => { // TODO make parameters configurable
                        if (r != Response.OK) top.fail(new Error(`TransferConfigure failed`, { cause: r })) 
                    }),

                    new ConnectCommand(Protocol.SWD, r => { 
                        if (r != ConnectResponse.SWD) top.fail(new Error(`Connect failed`, { cause: r })) 
                    })
                );
            }
            else if(top instanceof LinkTargetConnectOperation)
            {
                cmds.push(
                    new SwjSequenceCommand(
                        (7 + 2 + 7 + 1) * 8,
                        Uint8Array.of(
                            0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
                            0x9E, 0xE7,
                            0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
                            0x00
                        ),
                        r => {
                            if (r != Response.OK) top.fail(new Error(`SwjSequenceCommand failed`, { cause: r })) 
                        }
                    )
                )
            }
            else if(top instanceof LinkDriverShutdownOperation )
            {
                cmds.push(new DisconnectCommand(r => { 
                    if (r != Response.OK) top.fail(new Error(`Disconnect failed`, { cause: r })) 
                }));
            }
            else if(top instanceof UiOperation)
            {
                if(top.args.CONNECT !== undefined)
                {
                    cmds.push(new HostStatusCommand(HostStatusType.CONNECT, top.args.CONNECT, () => { 
                        if(top.done) top.done()
                    }));
                }
                else
                {
                    assert(top.args.RUNNING !== undefined)

                    cmds.push(new HostStatusCommand(HostStatusType.RUNNING, top.args.RUNNING, () => { 
                        if(top.done) top.done()
                    }));
                }
            }
            else if(top instanceof DelayOperation)
            {
                cmds.push(new DelayCommand(top.timeUs, () => {}));
            }
            else if(top instanceof ResetLineOperation)
            {
                const desired = top.assert ? 0 : SwjPinMask.nReset
                cmds.push(new SwjPinsCommand(desired, SwjPinMask.nReset, 20, r => {
                    if ((r & SwjPinMask.nReset) != desired) {
                        top.fail(new Error(`SwjPinsCommand failed`, { cause: r }))
                    }
                }))
            }
            else 
            {
                console.dir(top)
                throw new Error(`Unknown operation ${top}`)
            }
        })

        packetize(cmds, this.maxPacketSize, this.hasAtomic).forEach(p => this.sendPacket(p))
    }

    async stop(): Promise<void> {
        await this.interface.releaseAsync();

        if (this.reattachKernelDriver) {
            this.log.dbg("Re-ataching kernel driver")
            this.interface.attachKernelDriver();
        }

        this.usbDev.close();
    }
}
