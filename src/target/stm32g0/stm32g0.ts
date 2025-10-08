
import { TargetDriver, TargetInfo } from "../driver";
import { ApClass } from "../../core/adi";
import { Jep106_Manufacturer } from "../../data/jep106";
import { StPartNumbers } from "../../data/pidrPartNumbers";
import { CortexM0 } from "../../core/cm0";
import { defaultTraceConfig, operationLog } from "../../log";
import { Processor, SystemMemory, Target, Storage } from "../target";
import { ConnectOptions } from "../../core/connect";
import { Adapter } from "../../core/adapter";
import { DebugObserver } from "../../../executor/interpreter/observer.js";
import Interpreter from "../../../executor/interpreter/intepreter";
import { MemoryAccessScheduler } from "../../core/scheduler";
import { AhbLiteAp } from "../../core/ahbLiteAp";
import { MemoryTracer } from "../../core/memoryTrace";
import Procedure from "../../../executor/program/procedure";
import { DBG, RCC } from "./stm32g0hw";
import { Constant } from "../../../executor/program/expression";
import { DeviceSignature, identifyPackage, partName, sramSizeKb } from "./stm32g0identity";
import { LoadStoreWidth } from "../../../executor/program/common";

class CortexMcu
{
    constructor(
        readonly description: string,
        readonly interpreter: Interpreter,
        readonly cortex: CortexM0
    ) {}

    get systemMemory(): SystemMemory
    {
        return this.cortex.systemMemory
    }

    get processor(): Processor
    {
        return this.cortex.processor
    }
}

export class Stm32g0 extends CortexMcu implements Target
{
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
        async (
            adapter: Adapter,
            opts: ConnectOptions
        ) => {
            const mao = opts.trace?.memoryAccessTrace !== undefined ? new MemoryTracer(opts.trace.memoryAccessTrace) : undefined
            const io = opts.trace?.interpreterTrace !== undefined ? (args, rets) => new DebugObserver(opts.trace.interpreterTrace, args, rets) : undefined

            const mat = new AhbLiteAp(0, mao)
            const accessor = new MemoryAccessScheduler(
                ops => adapter.execute(...mat.translate(ops)),
                special => adapter.execute(special)
            )

            const interpreter = new Interpreter(accessor, io)
            const cortex = new CortexM0(operationLog(opts.trace).err, interpreter)

            await interpreter.run(Procedure.build($ => 
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

            if(opts.underReset)
            {
                await cortex.processor.reset(opts.halt)
            }
            else if(opts.halt)
            {
                await cortex.processor.halt()
            }

            const [part, pkgData, flashSizeKb] = await interpreter.run(Procedure.build($ => 
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

            return new Stm32g0(
                `${partName(part)} in ${identifyPackage(part, pkgData)} package`
                + ` with ${sramSizeKb(part)} kB RAM and ${flashSizeKb} kB flash`,
                interpreter, cortex
            )
        }
    )

    get storage(): Storage
    {
        throw "NYET"
    }

    // readonly storage = new class Stm32g0Storage implements Storage
    // {
    //     wipe = async () => 
    //     {
    //         const coreState = await cortex.processor.getState()
    //         if(coreState !== CoreState.Halted)
    //         {
    //             log.error(`Core is not halted before mass erase`)
    //         }

    //         await interpreter.executeOperations(...massErase());
    //     }

    //     readonly areas =
    //     [
    //         {
    //             desc: "Option bytes",
    //             base: 0x1fff_7800,
    //             size: 0x50,
    //         },
    //         {
    //             desc: "OTP",
    //             base: 0x1fff_7000,
    //             size: 0x400,
    //         },
    //         {
    //             desc: "Main flash",
    //             base: 0x0800_0000,
    //             size: flashSizeKb * 1024,
    //             write: 
    //             [
    //                 {
    //                     desc: "normal",
    //                     eraseSize: 2048,
    //                     programSize: 8,
    //                     perform: async (address, data) => 
    //                     {
    //                         assert((address & 7) === 0)
    //                         assert(0x0800_0000 <= address && address < 0x0800_0000 + flashSizeKb * 1024);

    //                         const end = (address + data.byteLength);
    //                         assert((end & 7) === 0)
    //                         assert(0x0800_0000 <= end && end < 0x0800_0000 + flashSizeKb * 1024);
                            
    //                         const coreState = await cortex.processor.getState()
    //                         if(coreState !== CoreState.Halted)
    //                         {
    //                             log.error(`Core is not halted before flash programming`)
    //                         }

    //                         await interpreter.executeOperations(...normalProgram(address, data))
    //                     }
    //                 },
    //                 {
    //                     desc: "fast",
    //                     eraseSize: 2048,
    //                     programSize: 256,
    //                     perform: async (address, data) => {
    //                         assert((address & 255) === 0)
    //                         assert(0x0800_0000 <= address && address < 0x0800_0000 + flashSizeKb * 1024);

    //                         const end = (address + data.byteLength);
    //                         assert((end & 255) === 0)
    //                         assert(0x0800_0000 <= end && end < 0x0800_0000 + flashSizeKb * 1024);
                            
    //                         const coreState = await cortex.processor.getState()
    //                         if(coreState !== CoreState.Halted)
    //                         {
    //                             log.error(`Core is not halted before flash programming`)
    //                         }

    //                         await interpreter.executeOperations(...fastProgram(address, data))
    //                     }
    //                 }
    //             ]
    //         }
    //     ]
    // }
}