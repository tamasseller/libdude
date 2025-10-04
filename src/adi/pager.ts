import { AdiOperation, AdiRead, AdiWait, AdiWrite, DebugPort } from "./defs";
import { DapOperation, DapWrite, DapDp, DapAction, DapRead, DapWait } from '../dap'

export class Pager
{
    dpbanksel?: number = undefined;
    apbanksel?: number = undefined;
    apsel?: number = undefined;

    private hasDpBank(dpbanksel: number): boolean {
        return this.dpbanksel === dpbanksel;
    }

    private hasApBank(apbanksel: number): boolean {
        return this.apbanksel === apbanksel;
    }

    private hasApSel(apsel: number): boolean {
        return this.apsel === apsel;
    }

    private select(dpbanksel: number, apbanksel: number, apsel: number, fail: (e: Error) => void): DapOperation 
    {
        this.dpbanksel = dpbanksel;
        this.apbanksel = apbanksel;
        this.apsel = apsel;

        return new DapWrite(
            DapDp,
            DebugPort.SELECT.address,
            Uint32Array.from([(apsel << 24) | (apbanksel << 4) | dpbanksel]),
            () => {},
            fail
        )
    }

    public toDap(ops: AdiOperation[]): DapOperation[]
    {
        const ret: DapOperation[] = [];

        const firstDpAccessBank = ops.find(o => o.register.port == DapDp && o.register.address == 0x04)?.register.bank ?? 0;
        const firstApAccess = ops.find(o => o.register.port != DapDp);

        const firstApAccessBank = firstApAccess?.register.bank ?? 0;
        const firstApAccessApsel = firstApAccess?.register.port ?? 0;

        for(const o of ops)
        {
            switch(o.register.port){
                case DapDp:
                    if(o.register.address == 0x04 && !this.hasDpBank(o.register.bank))
                    {
                        ret.push(this.select(o.register.bank, this.apbanksel ?? firstApAccessBank, this.apsel ?? firstApAccessApsel, o.fail))
                    }
                    break;
                default:
                    if(!this.hasApBank(o.register.bank) || !this.hasApSel(o.register.port!))
                    {
                        ret.push(this.select(this.dpbanksel ?? firstDpAccessBank, o.register.bank, o.register.port!, o.fail))
                    }
                    break;
            }

            switch(o.direction) {
                case DapAction.READ:
                    const r = o as AdiRead;
                    ret.push(new DapRead(r.register.port, r.register.address, r.count, r.done, o.fail));
                    break;
            
                case DapAction.WRITE:
                    const w = o as AdiWrite;
                    ret.push(new DapWrite(w.register.port, w.register.address, w.value, w.done, o.fail));
                    break;

                case DapAction.WAIT:
                    const a = o as AdiWait;
                    ret.push(new DapWait(a.register.port, a.register.address, a.mask, a.value, a.done, o.fail));
                    break;
            }
        }

        return ret;
    }
}