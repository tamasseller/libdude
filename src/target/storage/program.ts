import { Target } from "./target";
import { format32 } from "../format";
import { defaultTraceConfig, Log, operationLog } from "../log";
import { Chunk } from "./chunk";
import { Image } from "./image";

export async function program(target: Target, image: Image, preferred?: string, log: Log = operationLog(defaultTraceConfig)) 
{
    for(const area of target.storage.areas)
    {
        const pieces = image.getSegmentsInRange(area.base, area.size);

        if(pieces.length)
        {
            const areaName = area.desc ?? `area [${format32(area.base)} - ${format32(area.base + area.size)}]`

            if(area.write === undefined || area.write.length == 0)
            {
                throw new Error(`Don't know how to write ${areaName}!`)
            }
            
            const preferredWriter = ((preferred === undefined) ? undefined : area.write.find(w => w.desc?.includes(preferred)));
            const writer = preferredWriter ?? area.write[0] 

            const data = Chunk.consolidate(pieces)
            const padded = data.padToAlign(writer.programSize)
            const pages = padded.sliceAligned(writer.eraseSize)

            for(const p of pages)
            {
                const rangeName = `${format32(p.base)} - ${format32((p.base + p.data.length))}`
                log.dbg?.(`Writing range ${rangeName} in area ${areaName}` + (writer.desc ? ` using '${writer.desc}' method` : ''))

                await writer.perform(p.base, p.data)
            }
        }
    }
}