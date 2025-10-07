import { Device } from "usb";
import { defaultTraceConfig, Log, probeLog, TraceConfig } from "../log";
import { probeDrivers } from "./drivers";

import { Probe } from "./probe";
import './cmsis-dap/cmsis-dap'

export class ProbeRegistry
{
    public static get allVidPids(): {vid: number, pid: number}[] {
        return probeDrivers.map(d => d.ids).flat();
    }

    public static build(dev: Device, trace: TraceConfig = defaultTraceConfig) 
    {
        for(const drv of probeDrivers)
        {
            const vid = dev.deviceDescriptor.idVendor
            const pid = dev.deviceDescriptor.idProduct
            if(drv.ids.some(x => x.vid === vid && x.pid == pid))
            {
                return drv.build(probeLog(trace), dev)
            }
        }
    }
}

export function ProbeDriver(name: string, ids: {vid: number, pid: number}[]) 
{
    return function (target: any) {
        probeDrivers.push({name, ids, build: (log: Log, dev: Device) => new target(log, dev)});
    };
}