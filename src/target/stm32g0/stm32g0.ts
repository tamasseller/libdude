import { TargetDriver, TargetInfo } from "../driver";
import { Jep106_Manufacturer } from "../../data/jep106";
import { StPartNumbers } from "../../data/pidrPartNumbers";
import { ConnectOptions } from "../../core/connect";
import Procedure from "../../../executor/src/program/procedure";
import { DBG, RCC } from "./stm32g0hw";
import { Constant } from "../../../executor/src/program/expression";
import { DeviceSignature, identifyPackage, partName, sramSizeKb } from "./stm32g0identity";
import { LoadStoreWidth } from "../../../executor/src/program/common";
import { ApClass } from "../../data/adiRegisters";
import { AdiExecutor } from "../../operations/adiOperation";
import { defaultTraceConfig, memoryAccessLog, operationLog } from "../../trace/log";
import { AhbLiteAp } from "../../core/ahbLiteAp";
import { MemoryAccessAdapter } from "../../operations/memoryAccess";
import { Target, Storage } from "../../operations/target";
import { Cortex } from "../common/cortex";
import { massErase, slowFlash } from "./stm32g0flash";

export class Stm32g0 extends Cortex implements Target
{
    description: string = "?"
    program?: Storage

    public static driver = new TargetDriver<Stm32g0>(
        "stm32g0",
        (ti: TargetInfo) => 
        {
            if(ti.discoveredAps?.length !== 1) return false

            const ap = ti.discoveredAps[0]

            if(ap.idr.class != ApClass.MEM) return false
            if(ap.memAp?.pidr?.designer != Jep106_Manufacturer.STM) return false
            if(!(ap.memAp?.sysmem ?? false) && ap.memAp?.pidr?.part === undefined) return false

            return [
                StPartNumbers.STM32G03_4 as number,  
                StPartNumbers.STM32G05_6 as number, 
                StPartNumbers.STM32G07_8 as number, 
                StPartNumbers.STM32G0B_C as number
            ].includes(ap.memAp.pidr.part)
        },
        (adapter: AdiExecutor, opts: ConnectOptions) => Stm32g0.build(adapter, opts)
    )
        
    static async build(adapter: AdiExecutor, opts: ConnectOptions): Promise<Stm32g0>
    {
        const ret = new Stm32g0(
            new MemoryAccessAdapter(adapter, new AhbLiteAp(0, memoryAccessLog(opts.trace))),
            opts.trace ?? defaultTraceConfig
        )

        await ret.execute(Procedure.build($ => 
        {
            /* Enable the clock for the DBGMCU if it's not already */
            $.add(RCC.APBENR1.update(RCC.APBENR1.DBGEN.is(true)))

            /* Enable debugging during all low power modes */
            $.add(DBG.CR.update(
                DBG.CR.DBG_STANDBY.is(true), 
                DBG.CR.DBG_STOP.is(true)
            ))

            /* And make sure the WDTs stay synchronised to the run state of the processor */
            $.add(DBG.APB_FZ1.update(
                DBG.APB_FZ1.DBG_IWDG_STOP.is(true),
                DBG.APB_FZ1.DBG_WWDG_STOP.is(true)
            ))
        }))

        const halt = (opts.halt ?? false);
        // TODO join invocation
        if(opts.underReset)
        {
            const [nrstWorks] = await ret.execute(ret.debug.reset, halt ? 1 : 0)

            if(!nrstWorks)
            {
                operationLog(opts.trace).err("NRST dysfunctional, executed soft reset instead")
            }
        }
        else if(!halt)
        {
            await ret.execute(ret.debug.resume)
        }

        const [part, pkgData, flashSizeKb] = await ret.execute(Procedure.build($ => 
        {
            const part = $.declare(DBG.IDCODE.get(DBG.IDCODE.DEV_ID))
            const pkg = $.declare(new Constant(DeviceSignature.PackageData).load(LoadStoreWidth.U2).bitand(0xf))
            const flash = $.declare(new Constant(DeviceSignature.FlashSize).load(LoadStoreWidth.U2))
            $.return(part, pkg, flash)
        }))
    
        if(256 < flashSizeKb)
        {
            (opts.trace ?? defaultTraceConfig).error("Support for dual bank devices is incidental!")
        }

        ret.description = `${partName(part)} in ${identifyPackage(part, pkgData)} package`
                + ` with ${sramSizeKb(part)} kB RAM and ${flashSizeKb} kB flash`

        ret.program =
        {
            wipe: massErase,
            areas: [
                {
                    desc: "Option bytes",
                    base: 0x1fff_7800,
                    size: 0x50,
                },
                {
                    desc: "OTP",
                    base: 0x1fff_7000,
                    size: 0x400,
                },
                {
                    desc: "Main flash",
                    base: 0x0800_0000,
                    size: flashSizeKb * 1024,
                    write: 
                    [
                        {
                            desc: "normal",
                            eraseSize: 2048,
                            programSize: 8,
                            perform: slowFlash(flashSizeKb)
                        },
                        // {
                        //     desc: "fast",
                        //     eraseSize: 2048,
                        //     programSize: 256
                        //     perform: fastFlash(flashSizeKb)
                        // }
                    ]
                }
            ]
        }

        return ret
    }
}