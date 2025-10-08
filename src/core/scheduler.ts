import assert from "assert";
import MemoryAccessor from "../../executor/interpreter/accessor";
import { MemoryAccess, ReadMemory, WaitMemory, WriteMemory } from "./ahbLiteAp";

interface PendingAccess
{
    operation: any
    next?: PendingAccess
}

export class MemoryAccessScheduler implements MemoryAccessor
{
    private first: PendingAccess | undefined
    private last: PendingAccess | undefined

    constructor(
        private readonly execute: (ops: MemoryAccess[]) => void, 
        private readonly executeSpecial: (arg: any) => void, 
    ) {}

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
        return this.add(new ReadMemory(address, length, done,fail));
    }

    wait(address: number, mask: number, value: number, done: () => void, fail: (e: Error) => void): PendingAccess {
        return this.add(new WaitMemory(address, mask, value, done, fail));
    }

    special(param: any): PendingAccess {
        return this.add(param);
    }

    flush(handles: PendingAccess[]): void 
    {
        const h = new Set(handles)
        const xfer: MemoryAccess[] = []

        while(h.size)
        {
            const curr = this.first
            if(curr === undefined)
            {
                break;
            }
            
            h.delete(curr)
            const op = curr.operation

            if(op instanceof MemoryAccess)
            {
                xfer.push(op)
            }
            else
            {
                if(xfer.length)
                {
                    this.execute(xfer)
                    xfer.splice(0)
                }

                this.executeSpecial(op)
            }
            
            this.first = this.first!.next
        }

        if(this.first === undefined)
        {
            this.last = undefined
        }

        if(xfer.length)
        {
            this.execute(xfer)
        }
    }
}