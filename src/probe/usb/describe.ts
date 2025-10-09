import { usb } from "usb";
import { format16 } from "../../trace/format";

async function fetchStringDesciptor(dev: usb.Device, idx:number): Promise<string>
{
    return new Promise<string>((resolve, reject) => 
        dev.getStringDescriptor(idx, (error, value) => {
            if(error)
            {
                reject(error)
            }

            resolve(value ?? "???");
        })
    );
}

export async function describe(device: usb.Device): Promise<string> 
{
    const idxs = [
        device.deviceDescriptor.iManufacturer, 
        device.deviceDescriptor.iProduct, 
        device.deviceDescriptor.iSerialNumber
    ];
    
    const names: string[] = await Promise.all(idxs.map(x => fetchStringDesciptor(device, x)));

    return `${format16(device.deviceDescriptor.idVendor)}:${format16(device.deviceDescriptor.idProduct)} `
        + names.join(" ") 
        + ` (bus: ${device.busNumber}`
        + ` port(s): ${device.portNumbers.join("/")}`
        + ` address: ${device.deviceAddress})`
}
