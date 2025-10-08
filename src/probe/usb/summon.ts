import { usb, Device, findBySerialNumber, findByIds, getDeviceList } from "usb";
import { format16 } from "../../format";
import { describe } from "./describe";
import { promisify } from "util";

export type VidPid = {vid: number, pid: number}

export type Selector = VidPid | VidPid[] | string

function processSelector(selector: Selector): { name: string; get: () => Promise<usb.Device[]>; match: (d: Device) => Promise<boolean>; }
{
    switch(typeof selector)
    {
    case "string":
        return {
            name: `#${selector}`,
            get: async () => [await findBySerialNumber(selector)].filter(d => d !== undefined),
            match: async (d: Device) => selector === await promisify(d.getStringDescriptor).call(d, d.deviceDescriptor.iSerialNumber)
        }
    case "object":
        if(!Array.isArray(selector))
        {
            return {
                name: `${format16(selector.vid)}:${format16(selector.pid)}`,
                get: async () => [await findByIds(selector.vid, selector.pid)].filter(d => d !== undefined),
                match: async (d: Device) => d.deviceDescriptor.idVendor === selector.vid && d.deviceDescriptor.idProduct === selector.pid
            }   
        }
        else
        {
            return {
                name: "[" + selector.map(s => `${format16(s.vid)}:${format16(s.pid)}`).join(", ") + "]",
                get: async () => await getDeviceList().filter(d => 
                    {
                        const vid = d.deviceDescriptor.idVendor
                        const pid = d.deviceDescriptor.idProduct
                        return selector.some(x => x.vid === vid && x.pid == pid)
                    }
                ),
                match: async (d: Device) => {
                    const vid = d.deviceDescriptor.idVendor
                    const pid = d.deviceDescriptor.idProduct
                    return selector.some(x => x.vid === vid && x.pid == pid)
                }
            }                   
        }
    }
}

export async function summonUsbDevice(selector: Selector)
{
    const s = processSelector(selector)
    const [first, ...rest] = await s.get()

    if(first === undefined)
    {
        console.error(`Waiting for ${s.name}`)
        usb.refHotplugEvents();

        const ret = await new Promise<Device>(r => usb.on("attach", dev => s.match(dev).then(ok => {if(ok) r(dev)})));

        usb.removeAllListeners("attach");
        usb.unrefHotplugEvents();

        return ret;
    }
    else if(0 < rest.length)
    {
        console.error("Multiple devices match filter:\n--> " + [first, ...rest].map(d => `\t${describe(d)}\n`))
    }

    return first;
}