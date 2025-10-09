import Procedure from "../../executor/program/procedure"

export interface Target
{
    readonly description: string

    readSystemMemory(address: number, length: number): Promise<Buffer> 
    writeSystemMemory(address: number, data: Buffer): Promise<void> 
    execute(procedure: Procedure, ...args: (number | Buffer)[]): Promise<number[]> 

    debug?: ExecutionControl,
    program?: Storage
}

export interface ExecutionControl
{
    readonly writeCoreRegister: Procedure  // (number, number) => void
    readonly readCoreRegister: Procedure   // number => number
    readonly getState: Procedure           // () => number
    readonly halt: Procedure               // () => void
    readonly resume: Procedure             // () => void
    readonly reset: Procedure              // (halt: bool) => bool (nrst works)
}

export const enum CoreState 
{
    Running  = 0,
    Halted   = 1,
    Sleeping = 2,
    Failed   = 3,
}

export interface Storage
{
    wipe?: Procedure                       // (address: number, data: Buffer) => bool
    areas: NonVolatileMemoryArea[]
}

export interface NonVolatileMemoryArea 
{
    desc?: string,
    base: number,
    size: number,
    write?: ProgrammingMethod[]
}

export interface ProgrammingMethod 
{
    desc?: string,
    eraseSize: number,
    programSize: number,
    perform: Procedure                     // (address: number, data: Buffer) => bool
}
