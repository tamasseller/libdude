import { dapLog, defaultTraceConfig, TraceConfig } from "../log"
import { LinkDriverSetupOperation, LinkTargetConnectOperation, Probe, ResetLineOperation, UiOperation } from "../probe/probe"
import { Adapter } from "./adapter"
import { AbortMask, accessPortIdRegister, AccessPortIdRegisterValue, AdiOperation, ApClass, CtrlStatMask, DebugPort, MemApType, MemoryAccessPort, parseBase, parseIdcode, parseIdr } from "./adi"
import { AhbLiteAp } from "./ahbLiteAp"
import { BasicRomInfo, PidrValue, readCidrPidr, readSysmem } from "./coresight"
import { Target } from "./debugAdapter"
import MemoryTracer from "./memory/trace"
import MemoryAccessTranslator from "./memory/translator"
import { MemoryAccessScheduler } from "./scheduler"

/*
 * Configuration options passed to the target identification/initialization procedure.
 */
export interface ConnectOptions
{
    /*
     * Try to connect to the device while holding the hardware reset line asserted
     */
    underReset: boolean

    /*
     * Halt the core after connection
     */
    halt: boolean

    /*
     * Desired interface clock frequency
     */
    swdFrequencyHz?: number

    /*
     * Other target or adapter specific options.
     */
    [x: string]: unknown
}

export interface ApInfo
{
    apsel: number;
    idr: AccessPortIdRegisterValue
    memAp?: {
        mat: MemoryAccessTranslator
        pidr?: PidrValue
        sysmem?: boolean
    }
}

export async function connect(probe: Probe, opts: ConnectOptions, trace: TraceConfig = defaultTraceConfig): Promise<Target>
{
    let idcode = 0;

    const adapter = new Adapter(dapLog(trace), probe);

    await new Promise<void>((resolve, reject) => adapter.execute(
        /* Initialize physical interface */
        new LinkDriverSetupOperation({
            ...(opts.swdFrequencyHz ? {frequency: opts.swdFrequencyHz} : {})
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
    ))

    const aps = await discoverAps(adapter)

    const driverBuilder = await identifyDevice({
        dapId: parseIdcode(idcode),
        discoveredAps: aps
    })

    const accessor = new MemoryAccessScheduler(
        ops => adapter.execute(...driverBuilder.sysMemAp.translate(ops)),
        op => adapter.execute(op)
    );

    const driver = await driverBuilder.build(opts.ui, accessor, opts)

    await new Promise<void>((r, j) => adapter.execute(
        /* Indicate connection completion on potential adapter UI */
        new UiOperation({CONNECT: true}, j, r)
    ))

    return driver
}

async function discoverAps(adapter: Adapter): Promise<ApInfo[]>
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

        adapter.execute(...tasks);
        
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

async function processAp(adapter: Adapter, apsel: number, rawIdr: number) 
{
    const apInfo: ApInfo = {
        apsel: apsel,
        idr: parseIdr(rawIdr)
    }

    if (apInfo.idr.class == ApClass.MEM) 
    {
        switch (apInfo.idr.type) 
        {
            case MemApType.AHB3:
                apInfo.memAp = { 
                    mat: new AhbLiteAp(apsel, 
                        adapter.log.memoryAccessTrace
                            ? new MemoryTracer(adapter.log.memoryAccessTrace)
                            : undefined
                    )
                }
                break

            default: throw new Error("Unsupported memory access port")
        }

        const rom: number = await new Promise((resolve, reject) =>
            adapter.execute(new MemoryAccessPort(apsel).ROM.read(resolve, reject)))

        const base = parseBase(rom)
        if (base !== undefined) 
        {
            const info = await new Promise<BasicRomInfo | undefined>((resolve, reject) => 
                adapter.execute(...apInfo.memAp!.mat.translate([
                    readCidrPidr(base, resolve, reject)
                ]))
            )

            if (info !== undefined) {
                apInfo.memAp!.pidr = info!.pid
                apInfo.memAp!.sysmem = await new Promise<boolean | undefined>((resolve, reject) => 
                    adapter.execute(...apInfo.memAp!.mat.translate([
                        readSysmem(base, info!.class, resolve, reject)
                    ]))
                )
            }
        }
    }

    return apInfo
}
