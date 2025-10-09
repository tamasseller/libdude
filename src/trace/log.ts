import { Observer } from "../../executor/src/interpreter/observer"
import { Variable } from "../../executor/src/program/expression"
import { MemoryAccessObserver } from "../core/ahbLiteAp"
import { DebugObserver } from "./debugObserver"
import { MemoryTracer } from "./memoryTrace"

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
    packetTrace?: MessagePrinter
    operationTrace?: MessagePrinter
}

export const defaultTraceConfig: TraceConfig = {
    error: msg => console.error(msg),
    informational: msg => console.error(msg),
} as const


export function operationLog(trace: TraceConfig = defaultTraceConfig): Log
{
    return {
        err: trace.error,
        inf: trace.informational ?? (() => {}),
        dbg: trace.operationTrace ?? (() => {})
    }
}

export function debugObserver(trace: TraceConfig = defaultTraceConfig): ((args: Variable[], retvals: Variable[]) => Observer) | undefined
{
    const interpreterTrace = trace.interpreterTrace
    
    if(interpreterTrace)
    {
        return (args: Variable[], retvals: Variable[]) => new DebugObserver(interpreterTrace, args, retvals)
    }
}

export function probeLog(trace: TraceConfig = defaultTraceConfig): Log
{
    return {
        err: trace.error,
        inf: trace.informational ?? (() => {}),
        dbg: trace.packetTrace ?? (() => {})
    }
}

export function memoryAccessLog(trace: TraceConfig = defaultTraceConfig): MemoryAccessObserver | undefined
{
    if(trace.memoryAccessTrace)
    {
        return new MemoryTracer(trace.memoryAccessTrace)
    }
}