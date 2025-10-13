import { defaultTraceConfig, probeLog, TraceConfig } from "../trace/log";

import { CmsisDap } from "./cmsis-dap/cmsis-dap";
import { summonUsbDevice } from "./usb/summon";
import { ProbeDriver } from "./driver";
import { Probe } from "../operations/probe";

export class ProbeDrivers
{
    public static cmsisDap = CmsisDap.driver

    public static all: () => ProbeDriver<Probe>[] = () =>
    {
        ProbeDrivers.all = () => []
        const keys = Object.getOwnPropertyNames(ProbeDrivers);
        const vals = keys.map(key => (ProbeDrivers as any)[key]);
        const drvs = [...vals.filter(val => val instanceof ProbeDriver)];
        ProbeDrivers.all = () => drvs
        return drvs
    }

    public static get allVidPids(): {vid: number, pid: number}[] {
        return ProbeDrivers.all().map(d => d.ids).flat();
    }

    public static find(vid: number, pid: number): ProbeDriver<Probe> | undefined 
    {
        for(const drv of ProbeDrivers.all())
        {
            if(drv.ids.some(x => x.vid === vid && x.pid == pid))
            {
                return drv
            }
        }
    }

    public static async summon<T extends Probe>(which?: string, trace: TraceConfig = defaultTraceConfig): Promise<Probe>
    {
        const dev = await summonUsbDevice(which ?? this.allVidPids)
        const drv = ProbeDrivers.find(dev.deviceDescriptor.idVendor, dev.deviceDescriptor.idProduct)
        return drv?.build(probeLog(trace), dev)
    }
}
