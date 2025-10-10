import { bytes, format16, format32, format8 } from "./format"
import { MemoryAccessObserver } from "../core/ahbLiteAp"

export class MemoryTracer implements MemoryAccessObserver
{
    constructor(readonly log: (msg: string) => void) {}

    private static formatData(data: Buffer): string
    {
        switch(data.length)
        {
            case 1: return format8(data.readUInt8())
            case 2: return format16(data.readUInt16LE())
            case 4: return format32(data.readUInt32LE())
            default: 
                if(data.length < 64)
                {
                    return bytes(data)
                }
                else
                {
                    return `${bytes(data.subarray(0, 40))}... (${data.length} more bytes)`
                }
            
        }
    }

    observeWritten(address: number, data: Buffer): void  {
        this.log(`WR [${format32(address)}] <- ${MemoryTracer.formatData(data)}`)
    }

    observeRead(address: number, data: Buffer): void {
        this.log(`RD [${format32(address)}] -> ${MemoryTracer.formatData(data)}`)
    }

    observeWaited(address: number, mask: number, value: number): void {
        this.log(`WT [${format32(address)}] & ${format32(mask)} == ${format32(value)}`)
    }
}