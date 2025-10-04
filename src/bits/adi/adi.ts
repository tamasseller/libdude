import { DebugPort } from "./defs";

import * as dap from '../dap/dap'
import * as operations from "./operations";

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

    private select(dpbanksel: number, apbanksel: number, apsel: number, fail: (e: Error) => void): dap.Operation 
    {
        this.dpbanksel = dpbanksel;
        this.apbanksel = apbanksel;
        this.apsel = apsel;

        return new dap.WriteOperation(
            dap.DebugPort,
            DebugPort.SELECT.address,
            Uint32Array.from([(apsel << 24) | (apbanksel << 4) | dpbanksel]),
            () => {},
            fail
        )
    }

    public toDap(ops: operations.Operation[]): dap.Operation[]
    {
        const ret: dap.Operation[] = [];

        const firstDpAccessBank = ops.find(o => o.register.port == dap.DebugPort && o.register.address == 0x04)?.register.bank ?? 0;
        const firstApAccess = ops.find(o => o.register.port != dap.DebugPort);

        const firstApAccessBank = firstApAccess?.register.bank ?? 0;
        const firstApAccessApsel = firstApAccess?.register.port ?? 0;

        for(const o of ops)
        {
            switch(o.register.port){
                case dap.DebugPort:
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
                case dap.Action.READ:
                    const r = o as operations.ReadOperation;
                    ret.push(new dap.ReadOperation(r.register.port, r.register.address, r.count, r.done, o.fail));
                    break;
            
                case dap.Action.WRITE:
                    const w = o as operations.WriteOperation;
                    ret.push(new dap.WriteOperation(w.register.port, w.register.address, w.value, w.done, o.fail));
                    break;

                case dap.Action.WAIT:
                    const a = o as operations.WaitOperation;
                    ret.push(new dap.WaitOperation(a.register.port, a.register.address, a.mask, a.value, a.done, o.fail));
                    break;
            }
        }

        return ret;
    }
}