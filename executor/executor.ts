import assert from "assert";
import Procedure from "./program/procedure";

export class Invocation
{
    constructor(
        readonly procedure: Procedure,
        readonly args: (number | Buffer)[]
    ){
        assert(args.length == procedure.args.length)
    }
}

export class Operation extends Invocation
{
    constructor
    (
        readonly name: string,
        procedure: Procedure,
        args: (number | Buffer)[]
    ){
        super(procedure, args);
        assert(1 <= procedure.retvals.length)
    }
}

export default abstract class Executor
{
    abstract runMultiple(...invocations: Invocation[]): Promise<number[][]>

    async run(procedure: Procedure, ...args: (number | Buffer)[]): Promise<number[]> 
    {
        const [retvals] = await this.runMultiple(new Invocation(procedure, args));
        return retvals;
    }

    async executeOperations(...ops: Operation[]): Promise<void>
    {
        for(const op of ops)
        {
            const [status] = await this.run(op.procedure, ...op.args);
    
            if(status != 0)
            {
                throw new Error(`Operation '${op.name}' failed with status 0x${status.toString(16)}`)
            }
        }
    }
}