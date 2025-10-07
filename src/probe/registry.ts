import { defaultTraceConfig, Log, probeLog, TraceConfig } from "../log";

import { Probe } from "./probe";
import './cmsis-dap/cmsis-dap'
import { CmsisDap } from "./cmsis-dap/cmsis-dap";
import { Device } from "usb";
import { summonUsbDevice } from "./usb/summon";

export class ProbeDriver
{
    constructor(
        readonly name: string, 
        readonly ids: {vid: number, pid: number}[],
        readonly build: (log: Log, dev: Device) => Probe
    ) {}

    get selector(): Selector {
        return this.ids;
    }
}

export class ProbeDrivers
{
    public static cmsisDap = new ProbeDriver("CMSIS-DAP", [{vid: 0xc251, pid: 0xf001}], (log: Log, dev: Device) => new CmsisDap(log, dev))

    public static get all(): ProbeDriver[] 
    {
        const keys = Object.getOwnPropertyNames(ProbeDrivers);
        const vals = keys.map(key => (ProbeDrivers as any)[key]);
        return vals.filter(val => val instanceof ProbeDriver);
    }

    public static get allVidPids(): {vid: number, pid: number}[] {
        return ProbeDrivers.all.map(d => d.ids).flat();
    }

    public static find(vid: number, pid: number): ProbeDriver | undefined 
    {
        for(const drv of ProbeDrivers.all)
        {
            if(drv.ids.some(x => x.vid === vid && x.pid == pid))
            {
                return drv
            }
        }
    }

    public static async summon(which?: ProbeDriver | string, trace: TraceConfig = defaultTraceConfig)
    {
        const dev = await summonUsbDevice(typeof which === "string" ? which : (which?.selector ?? this.allVidPids))
        const drv = which instanceof ProbeDriver ? which : ProbeDrivers.find(dev.deviceDescriptor.idVendor, dev.deviceDescriptor.idProduct)
        return drv?.build(probeLog(trace), dev)
    }
}
