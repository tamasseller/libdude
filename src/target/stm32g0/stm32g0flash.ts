import { FLASH } from "./stm32g0hw";
import { Chunk } from "./chunk";
import Procedure from "../../../executor/program/procedure";
import { Special } from "../../../executor/program/statement";
import { DelayOperation } from "../../operations/probe";
import { Constant } from "../../../executor/program/expression";
import { Operation } from "../../../executor/executor";
import { format32 } from "../../trace/format";
import { stat } from "fs";

const prepareFlashFragment = $ => 
{
    // Wait busy
    $.add(FLASH.SR.wait(FLASH.SR.BSY1.is(false)))

    // Unlock flash
    $.branch(FLASH.CR.get(FLASH.CR.LOCK), $ =>
    {
        $.add(FLASH.KEYR.set(0x45670123))
        $.add(FLASH.KEYR.set(0xCDEF89AB))
        $.add(new Special(new DelayOperation(1, e => {throw e})))
        $.add(FLASH.CR.wait(FLASH.CR.LOCK.is(false)))
    }),

    // Clear any previous errors
    $.add(FLASH.SR.set(
        FLASH.SR.PROGERR.is(true),
        FLASH.SR.WRPERR.is(true),
        FLASH.SR.PGAERR.is(true),
        FLASH.SR.SIZERR.is(true),
        FLASH.SR.PGSERR.is(true),
        FLASH.SR.MISERR.is(true),
        FLASH.SR.FASTERR.is(true),
    )),

    $.return(new Constant(0))
};

const checkRdpFragment = $ => 
{
    $.return(FLASH.OPTR.get(FLASH.OPTR.RDP).ne(0xaa))
};

const checkWrpEnabledFragment = $ => 
{
    const wrp = $.declare(FLASH.WRP1AR.get())

    $.branch(wrp.bitand(0xff).le(wrp.shr(16).bitand(0xff)), $ => 
    {
        $.return(new Constant(1))
    })

    $.add(wrp.set(FLASH.WRP1BR.get()))
    $.branch(wrp.bitand(0xff).le(wrp.shr(16).bitand(0xff)), $ => 
    {
        $.return(new Constant(2))
    })

    $.return(new Constant(0))
};

const checkWrpEnabledForPages = Procedure.build($ => 
{
    const [first, last] = $.args

    // Check WRP area A
    const wrp = $.declare(FLASH.WRP1AR.get())
    $.branch(wrp.bitand(0xff).le(wrp.shr(16).bitand(0xff)
            .logand(wrp.bitand(0xff).le(last).logor(first.le(wrp.shr(16).bitand(0xff))))), 
        $ => $.return(wrp, wrp)
    )

    // Check WRP area B
    $.add(wrp.set(FLASH.WRP1BR.get()))
    $.branch(wrp.bitand(0xff).le(wrp.shr(16).bitand(0xff)
            .logand(wrp.bitand(0xff).le(last).logor(first.le(wrp.shr(16).bitand(0xff))))),
        $ => $.return(wrp, wrp)
    )

    $.return(new Constant(0), wrp)
});

const eraseAllFragment = $ => 
{
    // Select mass erase
    $.add(FLASH.CR.set(
        FLASH.CR.MER1.is(true),
    ))

    // Launch mass erase
    $.add(FLASH.CR.set(
        FLASH.CR.MER1.is(true),
        FLASH.CR.STRT.is(true)
    ))

    // Wait completion
    $.add(FLASH.SR.wait(FLASH.SR.BSY1.is(false)))

    // Read status
    $.return(FLASH.SR.get().bitand(0x3f8))
};

const erasePage = Procedure.build($ => 
{
    const [pageIdx] = $.args
    // Set erase parameters
    $.add(FLASH.CR.set(
        FLASH.CR.PNB.is(pageIdx),
        FLASH.CR.PER.is(true)
    ))

    // Launch page erase
    $.add(FLASH.CR.set(
        FLASH.CR.PNB.is(pageIdx),
        FLASH.CR.PER.is(true),
        FLASH.CR.STRT.is(true)
    ))

    // Wait completion
    $.add(FLASH.SR.wait(FLASH.SR.BSY1.is(false)))

    // Read status
    $.return(FLASH.SR.get().bitand(0x3f8))
});

const normalProgramFlash = Procedure.build($ => 
{
    const [dst, end, src] = $.args
    const ret = $.declare(0)

    // Enable programming
    $.add(FLASH.CR.set(FLASH.CR.PG.is(true)))

    // Do the programming
    $.loop(dst.lt(end), $ => 
    {
        for(let i = 0; i < 2; i++)
        {
            $.add(dst.store(src.load()))
            $.add(dst.increment(4))
            $.add(src.increment(4))
        }

        // Wait completion
        $.add(FLASH.SR.wait(FLASH.SR.BSY1.is(false)))

        // Read status
        $.add(ret.set(FLASH.SR.get().bitand(0x3f8)))

        // Bail out if failed
        $.branch(ret.ne(0), $ => $.break())
    }),

    // Disable programming
    $.add(FLASH.CR.set(FLASH.CR.PG.is(false)))

    $.return(ret)
});

const fastProgramFlash = Procedure.build($ => 
{
    const [dst, end, src] = $.args
    const ret = $.declare(0)

    // Enable programming
    $.add(FLASH.CR.set(FLASH.CR.FSTPG.is(true)))

    // Do the programming
    $.loop(dst.lt(end), $ =>
    {
        for(let i = 0; i < 32; i++)
        {
            $.add(dst.store(src.load()))
            $.add(dst.increment(4))
            $.add(src.increment(4))
        }

        // Wait completion
        $.add(FLASH.SR.wait(FLASH.SR.BSY1.is(false)))

        // Read status
        $.add(ret.set(FLASH.SR.get().bitand(0x3f8)))

        // Bail out if failed
        $.branch(ret.ne(0), $ => $.break())
    })

    // Disable programming
    $.add(FLASH.CR.set(FLASH.CR.FSTPG.is(false)))

    $.return(ret)
});

const lockFlashFragment = $ => 
{
    $.add(FLASH.CR.set(FLASH.CR.LOCK.is(true)))
    $.add(FLASH.CR.wait(FLASH.CR.LOCK.is(true)))

    $.return(new Constant(0))
};

export const massErase = Procedure.build($ => 
{
    $.add(FLASH.SR.wait(FLASH.SR.BSY1.is(false)))

    // Unlock flash
    $.branch(FLASH.CR.get(FLASH.CR.LOCK), $ =>
    {
        $.add(FLASH.KEYR.set(0x45670123))
        $.add(FLASH.KEYR.set(0xCDEF89AB))
        $.add(new Special(new DelayOperation(1, e => {throw e})))
        $.add(FLASH.CR.wait(FLASH.CR.LOCK.is(false)))
    }),

    // Clear any previous errors
    $.add(FLASH.SR.set(
        FLASH.SR.PROGERR.is(true),
        FLASH.SR.WRPERR.is(true),
        FLASH.SR.PGAERR.is(true),
        FLASH.SR.SIZERR.is(true),
        FLASH.SR.PGSERR.is(true),
        FLASH.SR.MISERR.is(true),
        FLASH.SR.FASTERR.is(true),
    )),

    $.add(FLASH.CR.set(
        FLASH.CR.MER1.is(true),
    ))

    // Launch mass erase
    $.add(FLASH.CR.set(
        FLASH.CR.MER1.is(true),
        FLASH.CR.STRT.is(true)
    ))

    // Wait completion
    $.add(FLASH.SR.wait(FLASH.SR.BSY1.is(false)))

    // Read status
    const status = $.declare(FLASH.SR.get().bitand(0x3f8))

    $.add(FLASH.CR.set(FLASH.CR.LOCK.is(true)))
    $.add(FLASH.CR.wait(FLASH.CR.LOCK.is(true)))

    $.return(status)

    // checkRdpFragment($)
    // checkWrpEnabledFragment($)
    // prepareFlashFragment($)
    // eraseAllFragment($)
    // lockFlashFragment($)
})

// const pageIndex = (addr: number) => (addr - 0x0800_0000) >>> 11

// function program(address: any, data: any, progProc: Procedure): Operation[]
// {
//     return [
//         new Operation("check readout protection", checkRdp, []),
//         new Operation("check flash write protection", checkWrpEnabledForPages, [
//             pageIndex(address), 
//             pageIndex(address + data.byteLength)
//         ]),
//         new Operation("unlock flash", prepareFlash, []),
//         ...Chunk.makeAligned(2048, address, data).map(ch => 
//         {
//             const pgIdx = pageIndex(ch.base)
//             const end = ch.base + ch.data.byteLength

//             return [
//                 new Operation(`erase page #${pgIdx}`, 
//                     erasePage, [pgIdx]),
//                 new Operation(`program range ${format32(ch.base)} - ${format32(end)} on page #${pgIdx}`, 
//                     progProc, [ch.base, end, ch.data])
//             ]
//         }).flat(),
//         new Operation("lock flash", lockFlash, []),
//     ]
// } 

// export function normalProgram(address: any, data: any): Operation[] {
//     return program(address, data, normalProgramFlash)
// } 

// export function fastProgram(address: any, data: any): Operation[] {
//     return program(address, data, fastProgramFlash)
// } 
