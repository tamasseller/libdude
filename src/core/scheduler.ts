import assert from "assert";
import { MemoryAccessor } from "../../executor/src/interpreter/accessor";
import { MemoryAccess, MemoryAccessExecutor, ReadMemory, WaitMemory, WriteMemory } from "../operations/memoryAccess";
import { LinkManagementOperation } from "../operations/probe";
import { AdiOperation } from "../operations/adiOperation";

interface PendingAccess
{
    operation: LinkManagementOperation | AdiOperation | MemoryAccess 
    next?: PendingAccess
}

export class MemoryAccessScheduler implements MemoryAccessor
{
    private first: PendingAccess | undefined
    private last: PendingAccess | undefined

    constructor(readonly mae: MemoryAccessExecutor) {}

    private add(operation: any)
    {
        const ret: PendingAccess = {operation: operation}

        if(this.last)
        {
            assert(this.last !== undefined)
            this.last.next = ret;
            this.last = ret;
        }
        else
        {
            assert(this.last === undefined)
            this.last = this.first = ret
        }

        return ret;
    }
    
    write(address: number, values: Buffer, done: () => void, fail: (e: Error) => void): PendingAccess {
        return this.add(new WriteMemory(address, values, done, fail));
    }

    read(address: number, length: number, done: (v: Buffer) => void, fail: (e: Error) => void): PendingAccess {
        return this.add(new ReadMemory(address, length, done, fail));
    }

    wait(address: number, mask: number, value: number, done: () => void, fail: (e: Error) => void): PendingAccess {
        return this.add(new WaitMemory(address, mask, value, done, fail));
    }

    special(param: LinkManagementOperation | AdiOperation): PendingAccess {
        return this.add(param);
    }

    flush(handles: PendingAccess[]): void 
    {
        const h = new Set(handles)
        const xfer: (LinkManagementOperation | AdiOperation | MemoryAccess)[] = []

        while(h.size)
        {
            const curr = this.first
            if(curr === undefined)
            {
                break;
            }
            
            h.delete(curr)
            xfer.push(curr.operation)

            this.first = this.first!.next
        }

        if(this.first === undefined)
        {
            this.last = undefined
        }

        if(xfer.length)
        {
            this.mae.execute(xfer)
        }
    }
}