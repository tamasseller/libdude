import assert, { deepStrictEqual } from "assert";
import { CoreState, Target } from "../../operations/target";
import { bytes, format32 } from "../../trace/format";
import { defaultTraceConfig, Log, operationLog } from "../../trace/log";
import { Chunk } from "./chunk";
import { Image } from "./image";

export async function program(target: Target, image: Image, preferred?: string, log: Log = operationLog(defaultTraceConfig)) 
{
    const [state] = await target.execute(target.debug!.getState);
    assert(state as CoreState == CoreState.Halted)
    assert(target.program)

    for(const area of target.program.areas)
    {
        const pieces = image.getSegmentsInRange(area.base, area.size);

        if(pieces.length)
        {
            const areaName = area.desc ?? `area [${format32(area.base)} - ${format32(area.base + area.size)}]`

            if(area.write === undefined || area.write.length == 0)
            {
                throw new Error(`Don't know how to write '${areaName}!'`)
            }
            
            const preferredWriter = ((preferred === undefined) ? undefined : area.write.find(w => w.desc?.includes(preferred)));
            const writer = preferredWriter ?? area.write[0] 

            const data = Chunk.consolidate(pieces)
            const padded = data.padToAlign(writer.programSize)
            const pages = padded.sliceAligned(writer.eraseSize)

            for(const p of pages)
            {
                const rangeName = `${format32(p.base)} - ${format32((p.base + p.data.length))}`
                log.dbg(`Writing range ${rangeName} in area '${areaName}'` + (writer.desc ? ` using '${writer.desc}' method` : ''))

                const [status] = await target.execute(writer.perform, p.base, p.data, p.data.length)
                if(status !== 0)
                {
                    throw new Error(`'${writer.desc}' failed in range ${rangeName} with status ${format32(status)}`)
                }
            }
        }
    }
}

export async function wipe(target: Target, log: Log = operationLog(defaultTraceConfig)): Promise<number> 
{
    const [state] = await target.execute(target.debug!.getState);
    assert(state as CoreState === CoreState.Halted)

    assert(target.program?.wipe)

    const [ret] = await target.execute(target.program.wipe);

    if(ret !== 0)
    {
        throw new Error(`Mass erase operation failed (${format32(ret)})`)
    }

    return ret
}

export async function verify(target: Target, image: Image, log: Log = operationLog(defaultTraceConfig)) 
{
    const [state] = await target.execute(target.debug!.getState);
    assert(state as CoreState == CoreState.Halted)
    assert(target.program)

    for(const area of target.program.areas)
    {
        const pieces = image.getSegmentsInRange(area.base, area.size);

        if(pieces.length)
        {
            const areaName = area.desc ?? `area [${format32(area.base)} - ${format32(area.base + area.size)}]`
            const readback = pieces.map<[Chunk, Promise<Buffer>]>(p => [p, target.readSystemMemory(p.base, p.data.length)])

            for (const [piece, promise] of readback)
            {
                log.dbg(`Verifying range ${format32(piece.base)} - ${format32((piece.base + piece.data.length))} in '${areaName}'`)

                const got = await promise
                const exp = piece.data;

                assert(got.length == exp.length)

                for(let i = 0; i < got.length; i++)
                {
                    if(got[i] !== exp[i])
                    {
                        throw new Error(`Verification error at ${format32(piece.base + i)}, in '${areaName}':\n\t`
                            + `exp: ${bytes(exp.subarray(i, i + 20))}\n\t`
                            + `got: ${bytes(got.subarray(i, i + 20))}\n`)
                    }
                }
            }
        }
    }
}
