import { Invocation } from "../executor/executor";
import Interpreter from "../executor/interpreter/intepreter";
import Procedure from "../executor/program/procedure";
import { Register, Field } from "../executor/register";
import { CoreState, Processor, SystemMemory, UiOptions } from "./debugAdapter";

import { reset, delay } from "./logic/operation";

export const enum CoreRegister 
{
    R0   = 0b00000,
    R1   = 0b00001,
    R2   = 0b00010,
    R3   = 0b00011,
    R4   = 0b00100,
    R5   = 0b00101,
    R6   = 0b00110,
    R7   = 0b00111,
    R8   = 0b01000,
    R9   = 0b01001,
    R10  = 0b01010,
    R11  = 0b01011,
    R12  = 0b01100,
    SP   = 0b01101,
    LR   = 0b01110,
    PC   = 0b01111,
    xPSR = 0b10000,
    MSP  = 0b10001,
    PSP  = 0b10010
}

export const DFSR = new class DFSR extends Register<DFSR> {
    constructor() { super(0xE000ED30); }
    readonly HALTED = new Field<DFSR, false>(1, 0);
    readonly BKPT = new Field<DFSR, false>(1, 1);
    readonly DWTTRAP = new Field<DFSR, false>(1, 2);
    readonly VCATCH = new Field<DFSR, false>(1, 3);
    readonly EXTERNAL = new Field<DFSR, false>(1, 4);
};

export const DHCSR = new class DHCSR extends Register<DHCSR> {
    constructor() { super(0xE000EDF0); }

    readonly C_DEBUGEN = new Field<DHCSR, true>(1, 0);
    readonly C_HALT = new Field<DHCSR, true>(1, 1);
    readonly C_STEP = new Field<DHCSR, true>(1, 2);
    readonly C_MASKINTS = new Field<DHCSR, true>(1, 3);
    readonly C_SNAPSTALL = new Field<DHCSR, true>(1, 5);
    readonly S_REGRDY = new Field<DHCSR, false>(1, 16);
    readonly S_HALT = new Field<DHCSR, false>(1, 17);
    readonly S_SLEEP = new Field<DHCSR, false>(1, 18);
    readonly S_LOCKUP = new Field<DHCSR, false>(1, 19);
    readonly S_RETIRE_ST = new Field<DHCSR, false>(1, 24);
    readonly S_RESET_ST = new Field<DHCSR, false>(1, 25);
    readonly DBGKEY = new Field<DHCSR, true>(16, 16);

    readonly DBGKEY_VALUE = 0xA05F;
};

export const DCRSR = new class DCRSR extends Register<DCRSR> {
    constructor() { super(0xE000EDF4); }
    readonly REGWnR = new Field<DCRSR, true>(1, 16);
    readonly REGSEL = new Field<DCRSR, true>(5, 0);
};

export const DCRDR = new class DCRDR extends Register<DCRDR> {
    constructor() { super(0xE000EDF8); }
};

export const DEMCR = new class DEMCR extends Register<DEMCR> {
    constructor() { super(0xE000EDFC); }
    readonly CORERESET = new Field<DEMCR, true>(1, 0);
    readonly HARDERR = new Field<DEMCR, true>(1, 10);
    readonly DWTENA = new Field<DEMCR, true>(1, 24);
};

export const AIRCR = new class AIRCR extends Register<AIRCR> {
    constructor() { super(0xE000ED0C); }
    readonly VECTRESET     = new Field<AIRCR, true>(1, 0);
    readonly VECTCLRACTIVE = new Field<AIRCR, true>(1, 1);
    readonly SYSRESETREQ   = new Field<AIRCR, true>(1, 2);
    readonly VECTKEY       = new Field<AIRCR, true>(16, 16);
    readonly VECTKEY_VALUE = 0x05FA;
};


export const writeReg = Procedure.build($ => 
{
    const [reg, value] = $.args
    $.add(DCRDR.set(value))
    $.add(DCRSR.set(DCRSR.REGSEL.is(reg), DCRSR.REGWnR.is(true)))
    $.add(DHCSR.wait(DHCSR.S_REGRDY.is(true)))
})

export const readReg = Procedure.build($ => 
{
    const [reg] = $.args
    $.add(DCRSR.set(DCRSR.REGSEL.is(reg), DCRSR.REGWnR.is(false)))
    $.add(DHCSR.wait(DHCSR.S_REGRDY.is(true)))
    $.return(DCRDR.get())
})

export const requestHalt = Procedure.build($ => 
{
    const [doHalt] = $.args
    $.add(DHCSR.update(
        DHCSR.C_DEBUGEN.is(true),
        DHCSR.C_HALT.is(doHalt),
        DHCSR.DBGKEY.is(DHCSR.DBGKEY_VALUE)
    ))
    $.add(DHCSR.wait(DHCSR.S_HALT.is(doHalt)))
})

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

        this.checkReset = async () => await interpreter.run(Procedure.build($ => 
        {
            $.return(DHCSR.get(DHCSR.S_RESET_ST))
        })).then(x => !!x[0])

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

            async getState(): Promise<CoreState> 
            {
                const [dhcsr] = await interpreter.run(Procedure.build($ => 
                {
                    $.return(DHCSR.get())
                }))

                return this.decodeCoreState(dhcsr)
            }

            async halt(): Promise<void> {
                await interpreter.run(requestHalt, 1)
            }

            async resume(address?: number): Promise<void> {
                await interpreter.runMultiple(...[
                    ...((address !== undefined) ? [new Invocation(writeReg, [CoreRegister.PC, address!])] : []),
                    new Invocation(requestHalt, [0])
                ])
            }

            async reset(halt: boolean = false): Promise<void> 
            {
                const [nrstWorks, dhcsr] = await interpreter.run(Procedure.build($ => 
                {
                    /*
                     * Assert hardware reset line
                     */
                    $.add(reset(true, r => { throw new Error(`Assert nRST failed`, { cause: r }); }))

                    /*
                     * Trap reset vector if halt is requested
                     */
                    if(halt)
                    {
                        $.add(DEMCR.update(DEMCR.CORERESET.is(true)))
                        $.add(DHCSR.set(
                            DHCSR.C_DEBUGEN.is(true),
                            DHCSR.DBGKEY.is(DHCSR.DBGKEY_VALUE)
                        ))
                    }

                    /*
                     * Read sticky reset flag twice, first read may return earlier value,
                     * NRST is functional if the second read has a positive results
                     */
                    const stickyReset = $.declare(DHCSR.get(DHCSR.S_RESET_ST))
                    $.add(stickyReset.set(DHCSR.get(DHCSR.S_RESET_ST)))

                    $.branch(stickyReset.eq(0), 
                        AIRCR.set(
                            AIRCR.VECTKEY.is(AIRCR.VECTKEY_VALUE),
                            AIRCR.SYSRESETREQ.is(true)
                        )
                    )

                    /* Release nRST */
                    $.add(reset(false, r_3 => { throw new Error(`Deassert nRST failed`, { cause: r_3 }); }))

                    /* Leave the target alone for 10ms to allow the reset to complete */
                    $.add(delay(10000, r_4 => { throw new Error(`Wait 10ms for reset to complete failed`, { cause: r_4 }); }))

                    /* Wait until the reset is actually completed */
                    $.add(DHCSR.wait(DHCSR.S_RESET_ST.is(false)))

                    /* Untrap reset vector */
                    $.add(DEMCR.update(DEMCR.CORERESET.is(false)))

                    const dhcsrOut = $.declare(DHCSR.get())

                    $.return(stickyReset, dhcsrOut)
                }));
                
                if (!nrstWorks) 
                {
                    log.error("NRST is dysfunctional, executed soft reset instead");
                }

                if(halt && this.decodeCoreState(dhcsr) !== CoreState.Halted) 
                {
                    log.error("Halting reset was requested but the processor is not halted after the operation");
                }
            }
        };
    }
}
