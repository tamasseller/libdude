import { CoreState, Processor, SystemMemory, UiOptions } from "../../debugAdapter";
import { Invocation } from "../../executor/executor";
import Interpreter from "../../executor/interpreter/intepreter";
import { branch, procedure } from "../../executor/program/procedure";
import * as logic from "../../logic/operation";
import { CoreRegister } from "./cm0def";
import { DHCSR, DEMCR, DCRDR, DCRSR, AIRCR } from "./cm0hw";

export const writeReg = procedure(2, 0, ([reg, value]) => [
    DCRDR.set(value),
    DCRSR.set(DCRSR.REGSEL.is(reg), DCRSR.REGWnR.is(true)),
    DHCSR.wait(DHCSR.S_REGRDY.is(true))
]);

export const readReg = procedure(1, 1, ([reg], [value]) => [
    DCRSR.set(DCRSR.REGSEL.is(reg), DCRSR.REGWnR.is(false)),
    DHCSR.wait(DHCSR.S_REGRDY.is(true)),
    value.set(DCRDR.get()),
]);

export const requestHalt = procedure(1, 0, ([doHalt]) => [
    DHCSR.update(
        DHCSR.C_DEBUGEN.is(true),
        DHCSR.C_HALT.is(doHalt),
        DHCSR.DBGKEY.is(DHCSR.DBGKEY_VALUE)
    ),
    DHCSR.wait(DHCSR.S_HALT.is(doHalt))
]);

export class CortexM0 
{
    readonly systemMemory: SystemMemory;
    readonly processor: Processor;

    protected readonly checkReset: () => Promise<boolean>
    protected readonly requestReset: () => Promise<boolean>
    protected readonly waitReset: () => Promise<void>

    constructor(log: UiOptions, interpreter: Interpreter) 
    {
        this.systemMemory = 
        {
            read: (address, length) => new Promise<Buffer>((r, j) => 
                interpreter.accessor.flush([interpreter.accessor.read(address, length, r, j)])),

            write: async (address, data) => new Promise<void>((r, j) => 
                interpreter.accessor.flush([interpreter.accessor.write(address, data, r, j)])),
        };

        this.checkReset = async () => 
            await interpreter.run(procedure(0, 1, (_, [ret]) => [
                DHCSR.get(DHCSR.S_RESET_ST)
            ])).then(x => !!x[0])

        this.processor = new class extends Processor 
        {
            async writeCoreRegisters(pairs: [number, number][]): Promise<void> {
                await interpreter.runMultiple(...pairs.map(pair => new Invocation(writeReg, pair)));
            }

            async readCoreRegisters(registers: number[]): Promise<number[]> {
                return (await interpreter.runMultiple(...registers.map(reg => new Invocation(readReg, [reg]))))
                    .map(x => x[0]);
            }

            private decodeCoreState(dhcsr: number): CoreState
            {
                if (dhcsr & DHCSR.S_LOCKUP.mask) return CoreState.Failed;
                else if (dhcsr & DHCSR.S_SLEEP.mask) return CoreState.Sleeping;
                else if (dhcsr & DHCSR.S_HALT.mask) return CoreState.Halted;
                else return CoreState.Running;
            }

            async getState(): Promise<CoreState> {
                const [dhcsr] = await interpreter.run(procedure(0, 1, (_, [ret]) => [
                    ret.set(DHCSR.get())
                ]))

                return this.decodeCoreState(dhcsr)
            }

            async halt(): Promise<void> {
                await interpreter.run(requestHalt, 1)
            }

            async resume(address?: number): Promise<void> {
                await interpreter.runMultiple(...[
                    ...addIf(address !== undefined, new Invocation(writeReg, [CoreRegister.PC, address!])),
                    new Invocation(requestHalt, [0])
                ])
            }

            async reset(halt: boolean = false): Promise<void> 
            {
                const [nrstWorks, dhcsr] = await interpreter.run(procedure(0, 2, (_, [stickyReset, dhcsrOut]) => [
                    /*
                     * Assert hardware reset line
                     */
                    logic.reset(true, r => { throw new Error(`Assert nRST failed`, { cause: r }); }),

                    /*
                     * Trap reset vector if halt is requested
                     */
                    ...addIf(halt, 
                        DEMCR.update(DEMCR.CORERESET.is(true)),
                        DHCSR.set(
                            DHCSR.C_DEBUGEN.is(true),
                            DHCSR.DBGKEY.is(DHCSR.DBGKEY_VALUE)
                        ),
                    ),

                    /*
                     * Read sticky reset flag twice, first read may return earlier value,
                     * NRST is functional if the second read has a positive results
                     */
                    stickyReset.set(DHCSR.get(DHCSR.S_RESET_ST)),
                    stickyReset.set(DHCSR.get(DHCSR.S_RESET_ST)),

                    branch(stickyReset.eq(0), 
                        AIRCR.set(
                            AIRCR.VECTKEY.is(AIRCR.VECTKEY_VALUE),
                            AIRCR.SYSRESETREQ.is(true)
                        )
                    ),

                    /* Release nRST */
                    logic.reset(false, r_3 => { throw new Error(`Deassert nRST failed`, { cause: r_3 }); }),

                    /* Leave the target alone for 10ms to allow the reset to complete */
                    logic.delay(10000, r_4 => { throw new Error(`Wait 10ms for reset to complete failed`, { cause: r_4 }); }),

                    /* Wait until the reset is actually completed */
                    DHCSR.wait(DHCSR.S_RESET_ST.is(false)),

                    /* Untrap reset vector */
                    DEMCR.update(DEMCR.CORERESET.is(false)),

                    dhcsrOut.set(DHCSR.get())
                ]));
                
                if (!nrstWorks) {
                    log.error("NRST is dysfunctional, executed soft reset instead");
                }

                if(halt && this.decodeCoreState(dhcsr) !== CoreState.Halted) {
                    log.error("Halting reset was requested but the processor is not halted after the operation");
                }
            }
        };
    }
}
