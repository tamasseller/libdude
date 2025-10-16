import { TraceConfig } from "../trace/log"
import { ApInfo, TargetDriver, TargetInfo } from "../target/driver"
import { TargetDrivers } from "../target/registry"
import { format32 } from "../trace/format"
import { CidrClass, parseBasicRomInfo } from "../data/coresight"
import { DebugPort, AbortMask, CtrlStatMask, parseIdcode, accessPortIdRegister, parseIdr, ApClass, MemApType, MemoryAccessPort, parseBase, CSWMask } from "../data/adiRegisters"
import { AdiExecutor, AdiOperation, AdiOperationAdapter } from "../operations/adiOperation"
import { Probe, LinkDriverSetupOperation, ResetLineOperation, LinkTargetConnectOperation, UiOperation, LinkDriverShutdownOperation } from "../operations/probe"
import { Target } from "../operations/target"

/*
 * Configuration options passed to the target identification/initialization procedure.
 */
export interface ConnectOptions
{
    /*
     * Try to connect to the device while holding the hardware reset line asserted
     */
    underReset?: boolean

    /*
     * Halt the core after connection
     */
    halt?: boolean

    /*
     * Desired interface clock frequency
     */
    swdFrequencyHz?: number

    swdIdleCycles?: number

    target?: TargetDriver<Target> | string

    trace?: TraceConfig

    /*
     * Other target or adapter specific options.
     */
    [x: string]: unknown
}

export async function connect(probe: Probe, opts: ConnectOptions = {}): Promise<Target>
{
    let idcode = 0;

    const adapter = new AdiOperationAdapter(probe);

    await new Promise<void>((resolve, reject) => adapter.execute([
        /* Initialize physical interface */
        new LinkDriverSetupOperation({
            ...(opts.swdFrequencyHz ? {frequency: opts.swdFrequencyHz} : {}),
            ...(opts.swdIdleCycles ? {idleCycles: opts.swdIdleCycles} : {})
        }, r => reject(new Error(`SWD link driver setup failed`, { cause: r }))),

        /* Assert nRST if reset is requested */
        ...(opts.underReset ? [new ResetLineOperation(true, r => reject(new Error(`Assert nRST failed`, { cause: r })))] : []),

        /* Do the SWJ dance*/
        new LinkTargetConnectOperation(undefined, r => reject(new Error(`SWJ selection sequence failed`, { cause: r }))),

        /* Read IDCODE */
        DebugPort.DPIDR.read(
            data => { idcode = data },
            r => reject(new Error(`IDCODE read failed`, { cause: r }))
        ),

        /* Clear sticky errors */
        DebugPort.ABORT.write(
            AbortMask.STKCMPCLR | AbortMask.STKERRCLR | AbortMask.ORUNERRCLR | AbortMask.WDERRCLR,
            undefined, r => reject(new Error(`Sticky error clear read failed`, { cause: r }))
        ),

        /* Assert powerup request */
        DebugPort.CTRL_STAT.write(
            CtrlStatMask.CDBGPWRUPREQ | CtrlStatMask.CSYSPWRUPREQ,
            undefined, r => reject(new Error(`CTRL_STAT write for powerup failed`, { cause: r }))
        ),

        /* Wait powerup acknowledgement */
        DebugPort.CTRL_STAT.wait(
            CtrlStatMask.CDBGPWRUPACK | CtrlStatMask.CSYSPWRUPACK,
            CtrlStatMask.CDBGPWRUPACK | CtrlStatMask.CSYSPWRUPACK,
            resolve, r => reject(new Error(`CTRL_STAT wait for powerup failed`, { cause: r }))
        ),
    ]))

    const ti: TargetInfo = {
        discoveredAps: await discoverAps(adapter),
        dapId: parseIdcode(idcode)
    }

    const drv = (opts.target instanceof TargetDriver) ? opts.target : TargetDrivers.select(ti, opts.target)
    const ret = await drv.build(adapter, opts);

    if(!ret)
    {
        disconnect(probe)
        throw `Identity validation (${drv.name}) failed for MCU with DAP idcode: ${format32(ti.dapId.raw)}}`;
    }

    await new Promise<void>((r, j) => adapter.execute([
        /* Indicate connection completion on potential adapter UI */
        new UiOperation({CONNECT: true}, j, r)
    ]))

    return ret
}

async function discoverAps(adapter: AdiExecutor): Promise<ApInfo[]>
{
    const discoveredAps: ApInfo[] = []

    const step = 8;
    for(let start = 0; start < 256; start += step)
    {
        const end = Math.min(start + step, 256);
        
        const tasks: AdiOperation[] = []
        const promises: Promise<number>[] = []
        for(let apsel = start; apsel < end; apsel++)
        {
            promises.push(new Promise((r, j) => {
                tasks.push(accessPortIdRegister(apsel).read(r, j))
            }))
        }

        adapter.execute(tasks);
        
        const rawIdrs = await Promise.all<number>(promises)
        const nonZeroRawIdrs = rawIdrs.map<[number, number]>((v, idx) => [v, idx]).filter(v => v[0] !== 0)

        const apInfos = await Promise.all(nonZeroRawIdrs.map(([v, idx]) => processAp(adapter, start + idx, v)))

        discoveredAps.push(...apInfos)

        if(apInfos.length !== step)
        {
            break;
        }
    }

    return discoveredAps;
}

async function processAp(adapter: AdiExecutor, apsel: number, rawIdr: number) 
{
    const apInfo: ApInfo = {
        apsel: apsel,
        idr: parseIdr(rawIdr)
    }

    if (apInfo.idr.class == ApClass.MEM) 
    {
        if (apInfo.idr.type !== MemApType.AHB3) 
        {
            throw new Error("Unsupported memory access port")
        }

        const map = new MemoryAccessPort(apsel);

        const rom: number = await new Promise((resolve, reject) => adapter.execute([map.ROM.read(resolve, reject)]))

        const base = parseBase(rom)
        if (base !== undefined) 
        {
            const rawRom = await new Promise<Uint32Array>((r, j) => adapter.execute([
                map.TAR.write((base + 0xfd0) >>> 0, undefined, j),
                map.CSW.write(CSWMask.VALUE | CSWMask.SIZE_32, undefined, j),
                map.DRW.readMultiple(12, r, j)
            ]))

            const romInfo = parseBasicRomInfo(rawRom)

            if (romInfo !== undefined) 
            {
                apInfo.memAp = {
                    pidr: romInfo.pid,
                    sysmem: await new Promise<boolean>((r, j) => adapter.execute([
                        map.TAR.write((base + (romInfo.class == CidrClass.RomTable ? 0xfcc : 0xfc8)) >>> 0, undefined, j),
                        map.DRW.read(d => r((d & (romInfo.class == CidrClass.RomTable ? 1 : 0x10)) != 0), j)
                    ]))
                }
            }
        }
    }

    return apInfo
}

export async function disconnect(probe: AdiExecutor): Promise<void>
{
    return new Promise<void>((resolve, reject) => probe.execute([
        DebugPort.ABORT.write(
            AbortMask.STKCMPCLR | AbortMask.STKERRCLR | AbortMask.ORUNERRCLR | AbortMask.WDERRCLR,
            undefined, r => reject(new Error(`Sticky error clear read failed`, { cause: r }))
        ),

        /* Deassert powerup request */
        DebugPort.CTRL_STAT.write(0, undefined, r => reject(new Error(`CTRL_STAT write for powerup failed`, { cause: r }))
        ),

        /* Wait acknowledgement */
        DebugPort.CTRL_STAT.wait(
            CtrlStatMask.CDBGPWRUPACK | CtrlStatMask.CSYSPWRUPACK,
            0,
            undefined, r => reject(new Error(`CTRL_STAT wait for powerup failed`, { cause: r }))
        ),

        new LinkDriverShutdownOperation(reject),
        new UiOperation({CONNECT: false}, reject, resolve)
    ]))
}