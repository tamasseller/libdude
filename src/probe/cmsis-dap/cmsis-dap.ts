
import * as protocol from "./protocol"

import { packetize } from './packetize';
import * as command from './command'

import * as usb from 'usb'

import assert from 'assert';
import { promisify } from 'util';
import { DapAction, DapDp, DapError, DapRead, DapWait, DapWrite } from "../../core/dap";
import { bytes, format16 } from "../../format";
import { DelayOperation, LinkDriverSetupOperation, LinkDriverShutdownOperation, LinkTargetConnectOperation, Probe, ProbeOperation, ResetLineOperation, TransferOperation, UiOperation } from "../probe";
import { Log } from "../../log";
import { ProbeDriver } from "../driver";

export const DEFAULT_CLOCK_FREQUENCY = 10000000;

const GET_REPORT = 0x01;
const SET_REPORT = 0x09;
const OUT_REPORT = 0x200;
const IN_REPORT = 0x100;

function convertTransferResponse(resp: protocol.TransferResponse)
{
    const ret: DapError[] = [];
    if(resp & protocol.TransferResponse.PROTOCOL_ERROR)
    {
        ret.push(DapError.ProtocolError)
    }

    if(resp & protocol.TransferResponse.VALUE_MISMATCH)
    {
        ret.push(DapError.ValueMismatch)
    }

    switch(resp & 7)
    {
        case protocol.TransferResponse.WAIT:
            ret.push(DapError.Wait)
            break

        case protocol.TransferResponse.FAULT:
            ret.push(DapError.Fault)
            break

        case protocol.TransferResponse.NO_ACK:
            ret.push(DapError.NoAck)
            break
    }

    return ret;
}

export class CmsisDap implements Probe
{
    static driver = new ProbeDriver("CMSIS-DAP", [{vid: 0xc251, pid: 0xf001}], async (log: Log, dev: usb.Device) => {
        return new CmsisDap(log, dev);
    })

    private interface: usb.Interface
    private inEp: usb.InEndpoint
    private outEp: usb.OutEndpoint

    private description: string;
    private reattachKernelDriver: boolean = false;

    private maxPacketSize: number = 64
    private hasAtomic: boolean = false

    constructor(readonly log: Log, private readonly usbDev: usb.Device) {}
    
    pktCounter = 0;
    protected sendPacket(p: command.Command): void 
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

        this.inEp = iface.endpoints.find(ep => ep.direction == 'in')! as usb.InEndpoint
        this.inEp.timeout = 5000;
        this.outEp = iface.endpoints.find(ep => ep.direction == 'out')! as usb.OutEndpoint
        this.outEp.timeout = 5000;

        return new Promise<string>(resolve => {
            let str = this.description;

            this.sendPacket(new command.InfoCommand(protocol.InfoRequest.CMSIS_DAP_FW_VERSION, resp => 
                str += ` cmsis-dap-version: ${resp.cmsisDapProtocolVersion}`
            ))

            this.sendPacket(new command.InfoCommand(protocol.InfoRequest.CAPABILITIES, resp => {
                str += ` capabilities: [${resp.capabilities!.toSring()}]`
                this.hasAtomic = resp.capabilities!.atomic_commands;
            }))

            this.sendPacket(new command.InfoCommand(protocol.InfoRequest.PACKET_SIZE, resp =>  {
                this.maxPacketSize = resp.maximumPacketSize!
                str += ` packet-size: ${resp.maximumPacketSize}`
                resolve(str)
            }))
        })
    }
    
    execute(ops: ProbeOperation[]): void 
    {
        const cmds: command.Command[] = []
        
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
                            let cmd: command.Command | undefined;

                            const done = (resp: protocol.TransferResponse): void => {
                                if(resp != protocol.TransferResponse.OK)
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
                                ? (new command.TransferCommand([
                                    command.TransferRequest.write(
                                        o.port != DapDp,
                                        o.register, 
                                        w.value[0],
                                        done
                                )]))
                                : new command.WriteBlockCommand(
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
                            let cmd: command.Command | undefined;

                            const done = (resp: protocol.TransferResponse, data: Uint32Array): void => {
                                if(resp != protocol.TransferResponse.OK)
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
                                ? new command.TransferCommand([
                                    command.TransferRequest.read(
                                        o.port != DapDp, o.register, (resp, data) => done(resp, Uint32Array.of(data))
                                    )    
                                ])
                                : new command.ReadBlockCommand(
                                    o.port != DapDp, o.register,  r.count, (resp, data) => done(resp, Uint32Array.of(...data))
                                )

                            cmds.push(cmd)
                            break;
                        }

                        case DapAction.WAIT:
                        {
                            const a = o as DapWait;
                            const setMask = command.TransferRequest.matchMask(o.port != DapDp, o.register, a.mask, resp => {
                                if(resp != protocol.TransferResponse.OK)
                                {
                                    o.fail(new Error(
                                        `Setup phase of wait operation ${a.toString()} implemented via ${setMask} resulted in error (code: ${resp})`, 
                                        {cause: convertTransferResponse(resp)}
                                    ))
                                }
                            })

                            const matchValue = command.TransferRequest.valueMatch(o.port != DapDp, o.register, a.value, resp => {
                                if(resp != protocol.TransferResponse.OK)
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

                            cmds.push(new command.TransferCommand([setMask, matchValue]));
                            break;
                        }
                    }
                })
            }
            else if(top instanceof LinkDriverSetupOperation)
            {
                cmds.push(
                    /* Clean up potential previous state */
                    new command.DisconnectCommand(r => { 
                        if (r != protocol.Response.OK) top.fail(new Error(`Disconnect failed`, { cause: r })) 
                    }),

                    /* Set up SWD link */
                    new command.SwjClockCommand(top.opts.frequency ?? DEFAULT_CLOCK_FREQUENCY, r => { 
                        if (r != protocol.Response.OK)  top.fail(new Error(`SwjClock failed`, { cause: r })) 
                    }),
                    
                    new command.TransferConfigureCommand(0, 32768, 32768, r => { // TODO make parameters configurable
                        if (r != protocol.Response.OK) top.fail(new Error(`TransferConfigure failed`, { cause: r })) 
                    }),

                    new command.ConnectCommand(protocol.Protocol.SWD, r => { 
                        if (r != protocol.ConnectResponse.SWD) top.fail(new Error(`Connect failed`, { cause: r })) 
                    })
                );
            }
            else if(top instanceof LinkTargetConnectOperation)
            {
                cmds.push(
                    new command.SwjSequenceCommand(
                        (7 + 2 + 7 + 1) * 8,
                        Uint8Array.of(
                            0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
                            0x9E, 0xE7,
                            0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
                            0x00
                        ),
                        r => {
                            if (r != protocol.Response.OK) top.fail(new Error(`SwjSequenceCommand failed`, { cause: r })) 
                        }
                    )
                )
            }
            else if(top instanceof LinkDriverShutdownOperation )
            {
                cmds.push(new command.DisconnectCommand(r => { 
                    if (r != protocol.Response.OK) top.fail(new Error(`Disconnect failed`, { cause: r })) 
                }));
            }
            else if(top instanceof UiOperation)
            {
                if(top.args.CONNECT !== undefined)
                {
                    cmds.push(new command.HostStatusCommand(protocol.HostStatusType.CONNECT, top.args.CONNECT, () => { 
                        if(top.done) top.done()
                    }));
                }
                else
                {
                    assert(top.args.RUNNING !== undefined)

                    cmds.push(new command.HostStatusCommand(protocol.HostStatusType.RUNNING, top.args.RUNNING, () => { 
                        if(top.done) top.done()
                    }));
                }
            }
            else if(top instanceof DelayOperation)
            {
                cmds.push(new command.DelayCommand(top.timeUs, () => {}));
            }
            else if(top instanceof ResetLineOperation)
            {
                const desired = top.assert ? 0 : protocol.SwjPinMask.nReset
                cmds.push(new command.SwjPinsCommand(desired, protocol.SwjPinMask.nReset, 20, r => {
                    if ((r & protocol.SwjPinMask.nReset) != desired) {
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
