import { Device } from "usb";
import { defaultTraceConfig, Log, probeLog, TraceConfig } from "../log";
import { Probe } from "./probe";
import { Selector, summonUsbDevice } from "./usb/summon";
import assert from "assert";

export class ProbeDriver<T extends Probe>
{
    constructor(
        readonly name: string, 
        readonly ids: {vid: number, pid: number}[],
        readonly build: (log: Log, dev: Device) => Promise<T>
    ) {}

    get selector(): Selector {
        return this.ids;
    }

    async summon(which?: string, trace: TraceConfig = defaultTraceConfig)
    {
        const dev = await summonUsbDevice(which ?? this.ids)
        assert(this.ids.some(id => id.vid == dev.deviceDescriptor.idVendor && id.pid == dev.deviceDescriptor.idProduct))

        return this.build(probeLog(trace), dev)
    }    
}