type MessagePrinter = (msg: string) => void

export interface Log
{
    err: MessagePrinter
    inf: MessagePrinter
    dbg: MessagePrinter
}

export interface TraceConfig
{
    error: MessagePrinter
    informational?: MessagePrinter
    interpreterTrace?: MessagePrinter
    memoryAccessTrace?: MessagePrinter
    dapTrace?: MessagePrinter
    packetTrace?: MessagePrinter
}

export const defaultTraceConfig: TraceConfig = {
    error: msg => console.error(msg),
    informational: msg => console.error(msg),
}

export function interpreterLog(trace: TraceConfig): Log
{
    return {
        err: trace.error,
        inf: trace.informational ?? (() => {}),
        dbg: trace.interpreterTrace ?? (() => {})
    }
}

export function memoryAccessLog(trace: TraceConfig): Log
{
    return {
        err: trace.error,
        inf: trace.informational ?? (() => {}),
        dbg: trace.memoryAccessTrace ?? (() => {})
    }
}

export function dapLog(trace: TraceConfig): Log
{
    return {
        err: trace.error,
        inf: trace.informational ?? (() => {}),
        dbg: trace.dapTrace ?? (() => {})
    }
}

export function probeLog(trace: TraceConfig): Log
{
    return {
        err: trace.error,
        inf: trace.informational ?? (() => {}),
        dbg: trace.packetTrace ?? (() => {})
    }
}
