import Interpreter from "../../../executor/src/interpreter/intepreter";
import { Special } from "../../../executor/src/interpreter/special";
import { Constant } from "../../../executor/src/program/expression";
import Procedure from "../../../executor/src/program/procedure";
import { MemoryAccessScheduler } from "../../core/scheduler";
import { AIRCR, DCRDR, DCRSR, DEMCR, DHCSR } from "../../data/cortexRegisters";
import { MemoryAccessAdapter } from "../../operations/memoryAccess";
import { DelayOperation, ResetLineOperation } from "../../operations/probe";
import { CoreState, ExecutionControl } from "../../operations/target";
import { TraceConfig, debugObserver } from "../../trace/log";

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

export class Cortex
{
    private readonly interpreter: Interpreter;
    private readonly accessor: MemoryAccessScheduler;

    constructor(
        maa: MemoryAccessAdapter,
        trace: TraceConfig
    ) {
        this.accessor = new MemoryAccessScheduler(maa)
        this.interpreter = new Interpreter(this.accessor, debugObserver(trace))
    }

    readSystemMemory(address: number, length: number): Promise<Buffer> 
    {
        return new Promise<Buffer>((r, j) => this.accessor.flush([this.accessor.read(address, length, r, j)]))
    }

    writeSystemMemory(address: number, data: Buffer): Promise<void> 
    {
        return new Promise<void>((r, j) => this.accessor.flush([this.accessor.write(address, data, r, j)]))
    }

    execute(procedure: Procedure, ...args: (number | Buffer)[]): Promise<number[]> 
    {
        return this.interpreter.run(procedure, ...args);
    }

    debug: ExecutionControl = 
    {
        writeCoreRegister: Procedure.build($ => {
            const [reg, value] = $.args;
            $.add(DCRDR.set(value));
            $.add(DCRSR.set(DCRSR.REGSEL.is(reg), DCRSR.REGWnR.is(true)));
            $.add(DHCSR.wait(DHCSR.S_REGRDY.is(true)));
        }),

        readCoreRegister: Procedure.build($ => {
            const [reg] = $.args;
            $.add(DCRSR.set(DCRSR.REGSEL.is(reg), DCRSR.REGWnR.is(false)));
            $.add(DHCSR.wait(DHCSR.S_REGRDY.is(true)));
            $.return(DCRDR.get());
        }),

        getState: Procedure.build($ => {
            const dhcsr = $.declare(DHCSR.get());

            $.branch(dhcsr.bitand(DHCSR.S_LOCKUP.mask), $ => $.return(new Constant(CoreState.Failed)));
            $.branch(dhcsr.bitand(DHCSR.S_SLEEP.mask), $ => $.return(new Constant(CoreState.Sleeping)));
            $.branch(dhcsr.bitand(DHCSR.S_HALT.mask), $ => $.return(new Constant(CoreState.Halted)));
            $.return(new Constant(CoreState.Running));
        }),

        halt: Procedure.build($ => {
            $.add(DHCSR.update(
                DHCSR.C_DEBUGEN.is(true),
                DHCSR.C_HALT.is(true),
                DHCSR.DBGKEY.is(DHCSR.DBGKEY_VALUE)
            ));
            $.add(DHCSR.wait(DHCSR.S_HALT.is(true)));
        }),

        resume: Procedure.build($ => {
            $.add(DHCSR.update(
                DHCSR.C_DEBUGEN.is(true),
                DHCSR.C_HALT.is(false),
                DHCSR.DBGKEY.is(DHCSR.DBGKEY_VALUE)
            ));
            $.add(DHCSR.wait(DHCSR.S_HALT.is(false)));
        }),

        reset: Procedure.build($ => {
            const [halt] = $.args;

            /*
             * Assert hardware reset line
             */
            $.add(new Special(new ResetLineOperation(true, r => { throw new Error(`Assert nRST failed`, { cause: r }); })));

            /*
             * Trap reset vector if halt is requested
             */
            $.branch(halt, $ => {
                $.add(DEMCR.update(DEMCR.CORERESET.is(true)));
                $.add(DHCSR.set(
                    DHCSR.C_DEBUGEN.is(true),
                    DHCSR.DBGKEY.is(DHCSR.DBGKEY_VALUE)
                ));
            });

            /*
             * Read sticky reset flag twice, first read may return earlier value,
             * NRST is functional if the second read has a positive results
             */
            const stickyReset = $.declare(DHCSR.get(DHCSR.S_RESET_ST));
            $.add(stickyReset.set(DHCSR.get(DHCSR.S_RESET_ST)));

            $.branch(stickyReset.eq(0),
                AIRCR.set(
                    AIRCR.VECTKEY.is(AIRCR.VECTKEY_VALUE),
                    AIRCR.SYSRESETREQ.is(true)
                )
            );

            /* Release nRST */
            $.add(new Special(new ResetLineOperation(false, r => { throw new Error(`Deassert nRST failed`, { cause: r }); })));

            /* Leave the target alone for 10ms to allow the reset to complete */
            $.add(new Special(new DelayOperation(10000, r => { throw new Error(`Wait 10ms for reset to complete failed`, { cause: r }); })));

            /* Wait until the reset is actually completed */
            $.add(DHCSR.wait(DHCSR.S_RESET_ST.is(false)));

            /* Untrap reset vector */
            $.add(DEMCR.update(DEMCR.CORERESET.is(false)));

            const dhcsrOut = $.declare(DHCSR.get());

            $.return(stickyReset, dhcsrOut);
        }),

        release: Procedure.build($ => {
            $.add(DHCSR.update(
                DHCSR.C_DEBUGEN.is(false),
                DHCSR.DBGKEY.is(DHCSR.DBGKEY_VALUE)
            ));
        }),
    }
}