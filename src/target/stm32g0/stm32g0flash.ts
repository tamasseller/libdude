import { FLASH } from "./stm32g0hw";
import Procedure from "../../../executor/src/program/procedure";
import { DelayOperation } from "../../operations/probe";
import { Constant, Expression } from "../../../executor/src/program/expression";
import { Special } from "../../../executor/src/interpreter/special";

const flashStart = 0x0800_0000;

const prepareFlash = Procedure.build($ => 
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
    ))
})

const checkRdp = Procedure.build($ => 
{
    $.return(FLASH.OPTR.get(FLASH.OPTR.RDP).ne(0xaa))
})

const checkWrpEnabled = Procedure.build($ => 
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
})

const checkWrpEnabledForPages = Procedure.build($ => 
{
    const [idx] = $.args

    // Check WRP area A
    const wrpa = $.declare(FLASH.WRP1AR.get())
    const wrpaStart = $.declare(wrpa.bitand(0xff))
    const wrpaEnd = $.declare(wrpa.shr(16).bitand(0xff))
    const wrpaActive = $.declare(wrpaStart.le(wrpaEnd))
    const wrpaMatch = $.declare(wrpaStart.le(idx).logand(idx.le(wrpaEnd)))

    $.branch(wrpaActive.logand(wrpaMatch),
        $ => $.return(wrpa)
    )

    // Check WRP area B
    const wrpb = $.declare(FLASH.WRP1BR.get())
    const wrpbStart = $.declare(wrpb.bitand(0xff))
    const wrpbEnd = $.declare(wrpb.shr(16).bitand(0xff))
    const wrpbActive = $.declare(wrpbStart.le(wrpbEnd))
    const wrpbMatch = $.declare(wrpbStart.le(idx).logand(idx.le(wrpbEnd)))

    $.branch(wrpbActive.logand(wrpbMatch),
        $ => $.return(wrpb)
    )

    $.return(new Constant(0))
});

const eraseAll = Procedure.build($ => 
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
})

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
    $.loop(dst.le(end), $ => 
    {
        const x = $.declare(src.read())
        $.add(src.increment(4))
        const y = $.declare(src.read())
        $.add(src.increment(4))

        $.add(dst.store(x))
        $.add(dst.increment(4))

        $.add(dst.store(y))
        $.add(dst.increment(4))

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

const lockFlash = Procedure.build($ => 
{
    $.add(FLASH.CR.set(FLASH.CR.LOCK.is(true)))
    $.add(FLASH.CR.wait(FLASH.CR.LOCK.is(true)))
});

export const massErase = Procedure.build($ => 
{
    const [rdpStatus] = $.call(checkRdp);
    $.branch(rdpStatus.ne(0), $ => $.return(rdpStatus.add(0x1_0000)))

    const [wrpStatus] = $.call(checkWrpEnabled);
    $.branch(wrpStatus.ne(0), $ => $.return(wrpStatus.add(0x2_0000)))

    $.call(prepareFlash)

    const [status] = $.call(eraseAll)

    $.call(lockFlash)

    $.branch(status.ne(0), $ => $.return(status.add(0x3_0000)))

    $.return(0)
})

const pageIndex = (e: Expression): Expression => e.sub(flashStart).shr(11)

export const slowFlash = (flashSizeKb) => Procedure.build($ => 
{
    const flashEnd = flashStart + flashSizeKb * 1024;
        
    const [address, data, length] = $.args

    $.branch(address.bitand(7).ne(0), $ => {
        $.diagnostic("Address not aligned")
        $.return(-1)
    })

    $.branch(address.lt(flashStart).logor(address.ge(flashEnd)) , $ => {
        $.diagnostic("Address not in flash region")
        $.return(-1)
    })

    const last = $.declare(address.add(length).sub(1));

    $.branch(last.bitand(7).ne(7), $ => {
        $.diagnostic("Size not aligned")
        $.return(-1)
    })

    $.branch(last.lt(flashStart).logor(last.ge(flashEnd)) , $ => {
        $.diagnostic("Data overflows main flash")
        $.return(-1)
    })

    const startIdx = $.declare(pageIndex(address));
    const endIdx = $.declare(pageIndex(last));

    $.branch(startIdx.ne(endIdx) , $ => {
        $.diagnostic("Multi page data not allowed")
        $.return(-1)
    })

    const [rdpStatus] = $.call(checkRdp);
    $.branch(rdpStatus.ne(0), $ => $.return(rdpStatus.add(0x1000_0000)))

    const [wrpStatus] = $.call(checkWrpEnabledForPages, startIdx);
    $.branch(wrpStatus.ne(0), $ => $.return(wrpStatus.add(0x2000_0000)))

    $.call(prepareFlash)

    const [eraseStatus] = $.call(erasePage, startIdx)
    $.branch(eraseStatus.ne(0), $ => $.return(eraseStatus.add(0x3000_0000)))

    const [programStatus] = $.call(normalProgramFlash, address, last, data)
    $.branch(programStatus.ne(0), $ => $.return(programStatus.add(0x4000_0000)))

    $.call(lockFlash)

    $.return(0)
})
