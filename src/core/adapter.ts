import { Log } from '../log'
import { Probe, ProbeOperation, TransferOperation } from '../probe/probe'
import { AdiOperation } from './adi'
import { Pager } from './pager'

class DebugAccessOperation
{
    ops: AdiOperation[]
    constructor(ops: AdiOperation[]) { this.ops = ops }
}

export class Adapter 
{
    private pager: Pager = new Pager

    constructor(readonly log: Log, readonly probe: Probe) {}

    execute(...ops: (ProbeOperation | AdiOperation)[]): void
    {
        const wrapped = ops.map(op => 
        {
            if(op instanceof AdiOperation) 
            {
                this.log.dbg(`${op}`)
                return new DebugAccessOperation([op])
            }

            return op;
        })

        const daoCoalesced = wrapped.reduce<(ProbeOperation|DebugAccessOperation)[]>((cd, ud) => 
        {
            const {length, [length - 1]: last} = cd;
            if(last instanceof DebugAccessOperation && ud instanceof DebugAccessOperation)
            {
                last.ops.push(...ud.ops)
                return cd;
            }

            return [...cd, ud]
        }, [])

        this.probe.execute(daoCoalesced.map(op => 
            (op instanceof DebugAccessOperation) 
            ? new TransferOperation(this.pager.toDap(op.ops)) 
            : op
        ))
    }
}
