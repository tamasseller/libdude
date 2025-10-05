import * as adiDef from '../adi'
import * as memAp from '../memory/mem-ap'
import * as coreSight from '../coresight'

import * as mcu from '../target/mcu'
import * as target from '../target/identify'

import * as operation from './operation'

import { MemoryAccessScheduler } from './scheduler'
import MemoryTracer from '../memory/trace'
import { ConnectOptions, DebugAdapter, Target, UiOptions } from '../debugAdapter'
import { Pager } from '../pager'

class DebugAccessOperation
{
    ops: adiDef.AdiOperation[]
    constructor(ops: adiDef.AdiOperation[]) { this.ops = ops }
}

export abstract class LowLevelAdapter implements DebugAdapter
{
    constructor(readonly log: UiOptions) {}

    public abstract claim(): Promise<string>
    public abstract release(): Promise<void>   

    private pager: Pager = new Pager

    protected abstract lowLevelExecute(ops: operation.LinkOperation[]): void
    
    execute(...ops: (operation.LinkOperation | adiDef.AdiOperation)[]): void
    {
        const wrapped = ops.map(op => 
        {
            if(op instanceof adiDef.AdiOperation) 
            {
                if(this.log.dapTrace) {
                    this.log.dapTrace(`${op}`)
                }

                return new DebugAccessOperation([op])
            }

            return op;
        })

        const daoCoalesced = wrapped.reduce<(operation.LinkOperation|DebugAccessOperation)[]>((cd, ud) => 
        {
            const {length, [length - 1]: last} = cd;
            if(last instanceof DebugAccessOperation && ud instanceof DebugAccessOperation)
            {
                last.ops.push(...ud.ops)
                return cd;
            }

            return [...cd, ud]
        }, [])

        const unDaod: operation.LinkOperation[] = daoCoalesced.map(op => 
            (op instanceof DebugAccessOperation) 
            ? new operation.TransferOperation(this.pager.toDap(op.ops)) 
            : op
        )

        this.lowLevelExecute(unDaod)
    }

    private async processAp(apsel: number, rawIdr: number) 
    {
        const apInfo: mcu.ApInfo = {
            apsel: apsel,
            idr: adiDef.parseIdr(rawIdr)
        }

        if (apInfo.idr.class == adiDef.ApClass.MEM) 
        {
            switch (apInfo.idr.type) 
            {
                case adiDef.MemApType.AHB3:
                    apInfo.memAp = { 
                        mat: new memAp.AhbLiteAp(apsel, 
                            this.log.memoryAccessTrace 
                                ? new MemoryTracer(this.log.memoryAccessTrace) : 
                                undefined
                        )        
                    }
                    break

                default: throw new Error("Unsupported memory access port")
            }

            const rom: number = await new Promise((resolve, reject) =>
                this.execute(new adiDef.MemoryAccessPort(apsel).ROM.read(resolve, reject)))

            const base = adiDef.parseBase(rom)
            if (base !== undefined) 
            {
                const info = await new Promise<coreSight.BasicRomInfo | undefined>((resolve, reject) => 
                    this.execute(...apInfo.memAp!.mat.translate([
                        coreSight.readCidrPidr(base, resolve, reject)
                    ]))
                )

                if (info !== undefined) {
                    apInfo.memAp!.pidr = info!.pid
                    apInfo.memAp!.sysmem = await new Promise<boolean | undefined>((resolve, reject) => 
                        this.execute(...apInfo.memAp!.mat.translate([
                            coreSight.readSysmem(base, info!.class, resolve, reject)
                        ]))
                    )
                }
            }
        }

        return apInfo
    }

    private async discoverAps(): Promise<mcu.ApInfo[]>
    {
        const discoveredAps: mcu.ApInfo[] = []

        const step = 8;
        for(let start = 0; start < 256; start += step)
        {
            const end = Math.min(start + step, 256);
            
            const tasks: adiDef.AdiOperation[] = []
            const promises: Promise<number>[] = []
            for(let apsel = start; apsel < end; apsel++)
            {
                promises.push(new Promise((r, j) => {
                    tasks.push(adiDef.accessPortIdRegister(apsel).read(r, j))
                }))
            }

            this.execute(...tasks);
            
            const rawIdrs = await Promise.all<number>(promises)
            const nonZeroRawIdrs = rawIdrs.map<[number, number]>((v, idx) => [v, idx]).filter(v => v[0] !== 0)

            const apInfos = await Promise.all(nonZeroRawIdrs.map(([v, idx]) => this.processAp(start + idx, v)))

            discoveredAps.push(...apInfos)

            if(apInfos.length !== step)
            {
                break;
            }
        }

        return discoveredAps;
    }

    public async connect(opts: ConnectOptions): Promise<Target>
    {
        let idcode = 0;

        await new Promise<void>((resolve, reject) => this.execute(
            /* Initialize physical interface */
            new operation.LinkDriverSetupOperation({
                ...(opts.swdFrequencyHz ? {frequency: opts.swdFrequencyHz} : {})
            }, r => reject(new Error(`SWD link driver setup failed`, { cause: r }))),

            /* Assert nRST if reset is requested */
            ...(opts.underReset ? [new operation.ResetLineOperation(true, r => reject(new Error(`Assert nRST failed`, { cause: r })))] : []),

            /* Do the SWJ dance*/
            new operation.LinkTargetConnectOperation(undefined, r => reject(new Error(`SWJ selection sequence failed`, { cause: r }))),

            /* Read IDCODE */
            adiDef.DebugPort.DPIDR.read(
                data => { idcode = data },
                r => reject(new Error(`IDCODE read failed`, { cause: r }))
            ),

            /* Clear sticky errors */
            adiDef.DebugPort.ABORT.write(
                adiDef.AbortMask.STKCMPCLR | adiDef.AbortMask.STKERRCLR | adiDef.AbortMask.ORUNERRCLR | adiDef.AbortMask.WDERRCLR,
                undefined, r => reject(new Error(`Sticky error clear read failed`, { cause: r }))
            ),

            /* Assert powerup request */
            adiDef.DebugPort.CTRL_STAT.write(
                adiDef.CtrlStatMask.CDBGPWRUPREQ | adiDef.CtrlStatMask.CSYSPWRUPREQ,
                undefined, r => reject(new Error(`CTRL_STAT write for powerup failed`, { cause: r }))
            ),

            /* Wait powerup acknowledgement */
            adiDef.DebugPort.CTRL_STAT.wait(
                adiDef.CtrlStatMask.CDBGPWRUPACK | adiDef.CtrlStatMask.CSYSPWRUPACK,
                adiDef.CtrlStatMask.CDBGPWRUPACK | adiDef.CtrlStatMask.CSYSPWRUPACK,
                resolve, r => reject(new Error(`CTRL_STAT wait for powerup failed`, { cause: r }))
            ),
        ))

        const driverBuilder = await target.identifyDevice({
            dapId: adiDef.parseIdcode(idcode),
            discoveredAps: await this.discoverAps()
        })

        const accessor = new MemoryAccessScheduler(
            ops => this.execute(...driverBuilder.sysMemAp.translate(ops)),
            op => this.execute(op)
        );

        const driver = await driverBuilder.build(opts.ui, accessor, 
            opts
        )

        await new Promise<void>((r, j) => this.execute(
            /* Indicate connection completion on potential adapter UI */
            new operation.UiOperation({CONNECT: true}, j, r)
        ))

        return driver
    }

    public disconnect(): Promise<void>
    {
        return new Promise<void>((resolve, reject) => this.execute(
            new operation.LinkDriverShutdownOperation(reject),
            new operation.UiOperation({CONNECT: false}, reject, resolve)
        ))
    }
}

