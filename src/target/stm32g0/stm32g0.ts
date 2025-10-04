import assert from "assert";

import * as mcu from "../mcu.ts";

import { ApClass } from "../../bits/adi/defs.ts";
import { Jep106_Manufacturer } from "../../bits/coresight/jep106.ts";
import { StPartNumbers } from '../../bits/coresight/pidrPartNumbers.ts'
import { Target, Storage, ConnectOptions, CoreState, UiOptions } from "../../adapter/debugAdapter.ts";

import MemoryAccessor from "../../executor/interpreter/accessor.ts";
import { Constant, LoadStoreWidth, procedure } from "../../executor/program/procedure.js";
import { CortexM0 } from "../cm0/cm0ops.ts";
import Interpreter from "../../executor/interpreter/intepreter.ts";

import { fastProgram, massErase, normalProgram } from "./stm32g0flash.ts";
import { DeviceSignature, partName, identifyPackage, sramSizeKb } from "./stm32g0identity.ts";
import { DebugObserver } from "../../executor/interpreter/observer.ts";
import { DBG, RCC } from "./stm32g0hw.ts";

export const stm32g0: mcu.TargetDriverFactory =
{
    name: "STM32G0xx",
    wouldTake: (ti: mcu.TargetInfo) => {
        if(ti.discoveredAps?.length === 1) {
            const ap = ti.discoveredAps[0];
            
            return ap.idr.class == ApClass.MEM 
                && (ap.memAp?.pidr?.designer == Jep106_Manufacturer.STM)
                && (ap.memAp?.sysmem ?? false) 
                && ap.memAp?.pidr?.part !== undefined
                && [
                    StPartNumbers.STM32G03_4 as number,  
                    StPartNumbers.STM32G05_6 as number, 
                    StPartNumbers.STM32G07_8 as number, 
                    StPartNumbers.STM32G0B_C as number
                ].includes(ap.memAp.pidr.part)
        }

        return false
    },

    prepare: (ti: mcu.TargetInfo) => ({
        sysMemAp: ti.discoveredAps![0].memAp?.mat!,
        build: async (
            log: UiOptions,
            accessor: MemoryAccessor,
            opts: ConnectOptions
        ) => {
            const interpreterTrace = opts.ui.interpreterTrace
            const interpreter = new Interpreter(accessor, 
                interpreterTrace !== undefined
                ? (args, rets) => new DebugObserver(interpreterTrace, args, rets)
                : undefined
            )

            const cortex = new CortexM0(log, interpreter)

            await interpreter.run(procedure(0, 0, () => 
            [
                    /* Enable the clock for the DBGMCU if it's not already */
                    RCC.APBENR1.update(RCC.APBENR1.DBGEN.is(true)),

                    /* Enable debugging during all low power modes */
                    DBG.CR.update(
                        DBG.CR.DBG_STANDBY.is(true), 
                        DBG.CR.DBG_STOP.is(true)
                    ),

                    /* And make sure the WDTs stay synchronised to the run state of the processor */
                    DBG.APB_FZ1.update(
                        DBG.APB_FZ1.DBG_IWDG_STOP.is(true),
                        DBG.APB_FZ1.DBG_WWDG_STOP.is(true)
                    ),
            ]))

            if(opts.underReset)
            {
                await cortex.processor.reset(opts.halt)
            }
            else if(opts.halt)
            {
                await cortex.processor.halt()
            }

            const [part, pkgData, flashSizeKb] = 
                await interpreter.run(procedure(0, 3, (_, [part, pkg, flash]) => [
                    part.set(DBG.IDCODE.get(DBG.IDCODE.DEV_ID)),
                    pkg.set(new Constant(DeviceSignature.PackageData).load(LoadStoreWidth.U2).bitand(0xf)),
                    flash.set(new Constant(DeviceSignature.FlashSize).load(LoadStoreWidth.U2)),
            ]))

            assert(part == ti.discoveredAps![0].memAp!.pidr!.part)

            if(256 < flashSizeKb)
            {
                log.error("Support for dual bank devices is incidental!")
            }

            return new class Stm32g0 implements Target
            {
                readonly description =  
                    `${partName(part)} in ${identifyPackage(part, pkgData)} package`
                    + ` with ${sramSizeKb(part)} kB RAM and ${flashSizeKb} kB flash`

                readonly systemMemory = cortex.systemMemory
                readonly processor = cortex.processor
                readonly storage = new class Stm32g0Storage implements Storage
                {
                    wipe = async () => 
                    {
                        const coreState = await cortex.processor.getState()
                        if(coreState !== CoreState.Halted)
                        {
                            log.error(`Core is not halted before mass erase`)
                        }

                        await interpreter.executeOperations(...massErase());
                    }

                    readonly areas =
                    [
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
                                    perform: async (address, data) => 
                                    {
                                        assert((address & 7) === 0)
                                        assert(0x0800_0000 <= address && address < 0x0800_0000 + flashSizeKb * 1024);

                                        const end = (address + data.byteLength);
                                        assert((end & 7) === 0)
                                        assert(0x0800_0000 <= end && end < 0x0800_0000 + flashSizeKb * 1024);
                                       
                                        const coreState = await cortex.processor.getState()
                                        if(coreState !== CoreState.Halted)
                                        {
                                            log.error(`Core is not halted before flash programming`)
                                        }

                                        await interpreter.executeOperations(...normalProgram(address, data))
                                    }
                                },
                                {
                                    desc: "fast",
                                    eraseSize: 2048,
                                    programSize: 256,
                                    perform: async (address, data) => {
                                        assert((address & 255) === 0)
                                        assert(0x0800_0000 <= address && address < 0x0800_0000 + flashSizeKb * 1024);

                                        const end = (address + data.byteLength);
                                        assert((end & 255) === 0)
                                        assert(0x0800_0000 <= end && end < 0x0800_0000 + flashSizeKb * 1024);
                                       
                                        const coreState = await cortex.processor.getState()
                                        if(coreState !== CoreState.Halted)
                                        {
                                            log.error(`Core is not halted before flash programming`)
                                        }

                                        await interpreter.executeOperations(...fastProgram(address, data))
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        }
    })
}