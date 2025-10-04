import { Chunk } from "../../../utility/chunk";
import { format32 } from "../../../utility/io";
import { Operation } from "../../executor/executor";
import Procedure, { branch, jump, loop, procedure, times} from "../../executor/program/procedure";
import { delay } from "../../logic/operation";
import { FLASH } from "./stm32g0hw";

const prepareFlash = procedure(0, 1, (_, [ret]) => 
[
    // Wait busy
    FLASH.SR.wait(FLASH.SR.BSY1.is(false)),

    // Unlock flash
    branch(FLASH.CR.get(FLASH.CR.LOCK), 
        FLASH.KEYR.set(0x45670123),
        FLASH.KEYR.set(0xCDEF89AB),
        delay(1),
        FLASH.CR.wait(FLASH.CR.LOCK.is(false))
    ),

    // Clear any previous errors
    FLASH.SR.set(
        FLASH.SR.PROGERR.is(true),
        FLASH.SR.WRPERR.is(true),
        FLASH.SR.PGAERR.is(true),
        FLASH.SR.SIZERR.is(true),
        FLASH.SR.PGSERR.is(true),
        FLASH.SR.MISERR.is(true),
        FLASH.SR.FASTERR.is(true),
    ),

    ret.set(0)
]);

const checkRdp = procedure(0, 1, (_, [ret]) => 
[
    ret.set(FLASH.OPTR.get(FLASH.OPTR.RDP).ne(0xaa)),
]);

const checkWrpEnabled = procedure(0, 2, (_, [ret, wrp]) => 
[
    wrp.set(FLASH.WRP1AR.get()),
    branch(wrp.bitand(0xff).le(wrp.shr(16).bitand(0xff)),
        ret.set(1),
        jump("return")
    ),

    wrp.set(FLASH.WRP1BR.get()),
    branch(wrp.bitand(0xff).le(wrp.shr(16).bitand(0xff)),
        ret.set(2),
        jump("return")
    ),

    ret.set(0),
]);

const checkWrpEnabledForPages = procedure(2, 2, ([first, last], [ret, wrp]) => 
[
    // Check WRP area A
    wrp.set(FLASH.WRP1AR.get()),
    branch(wrp.bitand(0xff).le(wrp.shr(16).bitand(0xff)
            .logand(wrp.bitand(0xff).le(last).logor(first.le(wrp.shr(16).bitand(0xff))))),
        ret.set(wrp),
        jump("return")
    ),

    // Check WRP area B
    wrp.set(FLASH.WRP1BR.get()),
    branch(wrp.bitand(0xff).le(wrp.shr(16).bitand(0xff)
            .logand(wrp.bitand(0xff).le(last).logor(first.le(wrp.shr(16).bitand(0xff))))),
        ret.set(wrp),
        jump("return")
    ),

    ret.set(0),
]);

const eraseAll = procedure(0, 1, (_, [ret]) => 
[
    // Select mass erase
    FLASH.CR.set(
        FLASH.CR.MER1.is(true),
    ),

    // Launch mass erase
    FLASH.CR.set(
        FLASH.CR.MER1.is(true),
        FLASH.CR.STRT.is(true)
    ),

    // Wait completion
    FLASH.SR.wait(FLASH.SR.BSY1.is(false)),

    // Read status
    ret.set(FLASH.SR.get().bitand(0x3f8)),
]);

const erasePage = procedure(1, 1, ([pageIdx], [ret]) => 
[
    // Set erase parameters
    FLASH.CR.set(
        FLASH.CR.PNB.is(pageIdx),
        FLASH.CR.PER.is(true)
    ),

    // Launch page erase
    FLASH.CR.set(
        FLASH.CR.PNB.is(pageIdx),
        FLASH.CR.PER.is(true),
        FLASH.CR.STRT.is(true)
    ),

    // Wait completion
    FLASH.SR.wait(FLASH.SR.BSY1.is(false)),

    // Read status
    ret.set(FLASH.SR.get().bitand(0x3f8)),
]);

const normalProgramFlash = procedure(3, 1, ([dst, end, src], [ret]) => 
[
    // Enable programming
    FLASH.CR.set(FLASH.CR.PG.is(true)),

    // Do the programming
    loop(dst.lt(end), 
        times(2,
            dst.store(src.load()),
            dst.increment(4),
            src.increment(4),
        ),

        // Wait completion
        FLASH.SR.wait(FLASH.SR.BSY1.is(false)),

        // Read status
        ret.set(FLASH.SR.get().bitand(0x3f8)),

        // Bail out if failed
        branch(ret.ne(0), jump("break")),
    ),

    // Disable programming
    FLASH.CR.set(FLASH.CR.PG.is(false)),
]);

const fastProgramFlash = procedure(3, 1, ([dst, end, src], [ret]) => 
[
    // Enable programming
    FLASH.CR.set(FLASH.CR.FSTPG.is(true)),

    // Do the programming
    loop(dst.lt(end), 
        times(32,
            dst.store(src.load()),
            dst.increment(4),
            src.increment(4),
        ),

        // Wait completion
        FLASH.SR.wait(FLASH.SR.BSY1.is(false)),

        // Read status
        ret.set(FLASH.SR.get().bitand(0x3f8)),

        // Bail out if failed
        branch(ret.ne(0), jump("break")),
    ),

    // Disable programming
    FLASH.CR.set(FLASH.CR.FSTPG.is(false)),
]);

const lockFlash = procedure(0, 1, (_, [ret]) => 
[
    FLASH.CR.set(FLASH.CR.LOCK.is(true)),
    FLASH.CR.wait(FLASH.CR.LOCK.is(true)),
    ret.set(0)
]);

export function massErase(): Operation[]
{
    return [
        new Operation("check readout protection", checkRdp, []),
        new Operation("check flash write protection", checkWrpEnabled, []),
        new Operation("unlock flash", prepareFlash, []),
        new Operation("execute mass erase", eraseAll, []),
        new Operation("lock flash", lockFlash, []),
    ]
}

const pageIndex = (addr: number) => (addr - 0x0800_0000) >>> 11

function program(address: any, data: any, progProc: Procedure): Operation[]
{
    return [
        new Operation("check readout protection", checkRdp, []),
        new Operation("check flash write protection", checkWrpEnabledForPages, [
            pageIndex(address), 
            pageIndex(address + data.byteLength)
        ]),
        new Operation("unlock flash", prepareFlash, []),
        ...Chunk.makeAligned(2048, address, data).map(ch => 
        {
            const pgIdx = pageIndex(ch.base)
            const end = ch.base + ch.data.byteLength

            return [
                new Operation(`erase page #${pgIdx}`, 
                    erasePage, [pgIdx]),
                new Operation(`program range ${format32(ch.base)} - ${format32(end)} on page #${pgIdx}`, 
                    progProc, [ch.base, end, ch.data])
            ]
        }).flat(),
        new Operation("lock flash", lockFlash, []),
    ]
} 

export function normalProgram(address: any, data: any): Operation[] {
    return program(address, data, normalProgramFlash)
} 

export function fastProgram(address: any, data: any): Operation[] {
    return program(address, data, fastProgramFlash)
} 
