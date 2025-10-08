/*
 * Entry point for DUDE target device (i.e. MCU) operations
 */
export interface Target
{
    /*
     * Human readable description of the target device
     */
    readonly description: string

    /*
     * Regular system memory address space accessor
     */
    readonly systemMemory: SystemMemory

    /*
     * Processor state manipulator
     */
    readonly processor: Processor

    /*
     * Code and configuration programming procedures
     */
    readonly storage: Storage
}

/*
 * Basic memory access operations
 */
export interface SystemMemory
{
    /*
     * Read an arbitrary part of the system memory address space without alignment requirements
     */
    read(address: number, length: number): Promise<Buffer> 

    /*
     * Write an arbitrary part of the system memory address space without alignment requirements
     */
    write(address: number, data: Buffer): Promise<void> 
}

/*
 * Processor control operations
 */
export abstract class Processor
{
    /*
     * Set values for core registers
     */
    abstract writeCoreRegisters(pairs: [number /* reg */, number /* value */][]): Promise<void> 

    /*
     * Set the value of a core register
     */
    writeCoreRegister(register: number, value: number): Promise<void> {
        return this.writeCoreRegisters([[register, value]])
    }

    /*
     * Get values of core registers
     */
    abstract readCoreRegisters(registers: number[]): Promise<number[]>

    /*
     * Get the value of a core register
     */
    readCoreRegister(register: number) {
        return this.readCoreRegisters([register]).then(x => x[0])
    }

    /*
     * Get the execution state of the core
     */
    abstract getState(): Promise<CoreState> 

    /*
     * Suspend execution
     */
    abstract halt(): Promise<void>

    /*
     * Resume execution at either the next instruction 
     * or at the specified address
     */
    abstract resume(address?: number): Promise<void>

    /*
     * Reset core, optionally halting execution right at the entrypoint.
     */
    abstract reset(halt?: boolean): Promise<void> 
}

/*
 * Abstract execution states of a processor
 */
export const enum CoreState {
    /*
     * Instructions are being executed
     */
    Running,

    /*
     * Execution is halted and can be resumed via the regular resume operation
     */
    Halted,

    /*
     * The processor is in a (possibly low power) sleep state, execution can be resumed.
     */
    Sleeping,

    /*
     * The processor encountered a fatal error and needs to be reset to restart execution.
     */
    Failed,
}

/*
 * Main configuration/code flashing operation interface
 */
export interface Storage
{
    /*
     * Clear storage as much as possible (i.e. mass-erease)
     */
    wipe?(): Promise<void>

    /*
     * List of available storage areas
     */
    areas: NonVolatileMemoryArea[]
}

/*
 * Code/config storage area information and operations 
 */
export interface NonVolatileMemoryArea {
    /*
     * Optional description of the memory area (e.g. flash page #n, fuse bits, etc...)
     */
    desc?: string,

    /*
     * Base address in system memory space (used for image load address matching)
     */
    base: number,

    /*
     * Total length in system memory space (used for image load address matching)
     */
    size: number,

    /*
     * Available write operations
     */
    write?: ProgrammingMethod[]
}

/*
 * Code/config storage area erase+programming procedure
 */
export interface ProgrammingMethod {
    /*
     * Optional description of the procedure (e.g. fast/regular programming)
     */
    desc?: string,

    /*
     * The erase block size of the operation.
     *
     * It is expected that the procedure thrashes all size aligned blocks of 
     * this size that are touched by the write interval
     */
    eraseSize: number,

    /*
     * The block size of the programming part of the operation.
     *
     * The procedure receives a block whose base address and length is aligned to this size
     */
    programSize: number,

    /*
     * Perform the programming operation (and erase first if needed)
     */
    perform: (address: number, data: Buffer) => Promise<void>
}

