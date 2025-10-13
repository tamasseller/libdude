#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "--import" "tsx" "$0" "$@"

import assert from "node:assert";
import { defaultTraceConfig, operationLog, TraceConfig } from "../src/trace/log";
import { ProbeDrivers } from "../src/probe/registry";
import { connect, disconnect } from "../src/core/connect";
import { readFileSync } from "node:fs";
import { Image } from "../src/target/storage/image";
import { program } from "../src/target/storage/program";
import { format16 } from "../src/trace/format";
import { Probe } from "../src/operations/probe";

const validTraces = ["interpreter", "memory", "operation", "packets"] as const;
type ValidTrace = typeof validTraces[number]

function isValidTrace(maybeValidTrace: unknown): maybeValidTrace is ValidTrace {
    return typeof maybeValidTrace === 'string' && validTraces.map(x => x as string).includes(maybeValidTrace);
}

const operations = ["wipe", "write", "verify"] as const;
type Operation = typeof operations[number]

function isOperation(maybeOperation: unknown): maybeOperation is Operation {
    return typeof maybeOperation === 'string' && operations.map(x => x as string).includes(maybeOperation);
}

function processArgs(argv: string[]): { 
    operation: Operation
    filename: string
    quiet: boolean
    trace: ValidTrace[]
    dev?: { vid: number; pid: number; }
    serial?: string
    freq?: number
    preferred?: string
} {
    if (argv.length < 3) 
    {
        throw new Error(
            `\nUsage: ${argv[0]} [--quiet] [--trace {trace channels,}] [--dev vid:pid] [--serial serialNumber] [--freq value] [--preferred write-method] <op> [<filename>]\n\n` 
            + `operations:\n`
            + `  wipe   - mass erase target\n`
            + `  write  - write (and verify) the specified file on the target\n`
            + `  verify - verify that the specified file is written on the target\n`);
    }

    let opts: 
    {
        trace: ValidTrace[]
        freq?: number
        quiet: boolean
        preferred?: string
        serial?: string
        dev?: { vid: number; pid: number; }
    } = {
        trace: [],
        quiet: false
    };

    let positional: string[] = []; 

    for (let i = 2; i < argv.length; i++) 
    {
        const arg = argv[i];

        if (!arg.startsWith("--")) 
        {
            positional.push(arg)
        }
        else if (arg === "--dev") 
        {
            const val = argv[++i];

            if (!val || !/^[0-9a-fA-F]+:[0-9a-fA-F]+$/.test(val)) {
                throw new Error("Error: --dev expects argument in vid:pid (hex) format");
            }

            const [vidHex, pidHex] = val.split(":");

            opts.dev = {
                vid: parseInt(vidHex, 16),
                pid: parseInt(pidHex, 16),
            };
        }
        else if (arg === "--freq") 
        {
            const val = argv[++i];
            if (!val || !/^\d+(\.\d+)?[kKmM]?$/.test(val)) {
                throw new Error("Error: --freq expects a numeric value, optionally with 'k' or 'M' suffix (e.g. 1000, 500k, 4.5M)");
            }

            const num = parseFloat(val);
            if (val.toLowerCase().endsWith("k")) {
                opts.freq = num * 1e3;
            } else if (val.toLowerCase().endsWith("m")) {
                opts.freq = num * 1e6;
            } else {
                opts.freq = num;
            }
        }
        else if (arg === "-q" || arg === "--quiet") 
        {
            opts.quiet = true;
        }
        else if (arg === "--trace") 
        {
            const val = argv[++i];
            if (!val) 
            {
                throw new Error("Error: --trace expects a comma-separated list");
            }

            for (const t of val.split(",").map(t => t.trim())) 
            {
                if (!isValidTrace(t)) 
                {
                    throw new Error(`Error: invalid trace category '${t}'. Valid options: ${validTraces.join(", ")}`);
                }

                opts.trace.push(t)
            }
        }
        else if (arg === "--serial") 
        {
            const val = argv[++i];

            if (!val) 
            {
                throw new Error("Error: --serial expects a string argument");
            }
            
            opts.serial = val;
        } 
        else if (arg === "--preferred") 
        {
            const val = argv[++i];

            if (!val) 
            {
                throw new Error("Error: --preferred expects a string argument");
            }
            
            opts.preferred = val;
        }
        else 
        {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }

    const [op, filename] = positional
    if(!op) throw new Error("Error: no operation specified");

    switch(op)
    {
        case "wipe":
            return {operation: "wipe", filename: "???", ...opts};
        case "write":
            if(!filename) throw new Error("Error: filename is required");
            return {operation: "write", filename, ...opts};
        case "verify":
            if(!filename) throw new Error("Error: filename is required");
            return {operation: "verify", filename, ...opts};
        default:
            throw new Error(`Error: unknown operation '${op}'`);
    }
}

function assembleTraceConfig(args: { trace: ValidTrace[]; quiet: boolean; }): TraceConfig
{
    const ret = {...defaultTraceConfig};

    if(args.quiet) ret.informational = () => {}
    if (args.trace.includes("operation"))         ret.operationTrace    = msg => console.error(msg)
    if (args.trace.includes("interpreter")) ret.interpreterTrace  = msg => console.error(msg)
    if (args.trace.includes("memory"))      ret.memoryAccessTrace = msg => console.error(msg)
    if (args.trace.includes("packets"))     ret.packetTrace       = msg => console.error(msg)

    return ret;
}

function summonProbe(
    args: {
        serial?: string;
        dev?: { vid: number; pid: number; };
    }, 
    traceConfig: TraceConfig
): Promise<Probe>
{
    if(args.dev !== undefined)
    {
        const drv = ProbeDrivers.find(args.dev.vid, args.dev.pid)

        if(!drv)
        {
            throw new Error(`No driver for ${format16(args.dev.vid)}:${format16(args.dev.pid)}`)
        }

        return drv.summon(args.serial, traceConfig)
    } 

    return ProbeDrivers.summon(args.serial, traceConfig)
}
    
async function main(): Promise<number>
{
    const args = processArgs(process.argv)
    const traceConfig = assembleTraceConfig(args)
    const probe = await summonProbe(args, traceConfig);
    assert(probe)

    const image = await Image.readElf(readFileSync(args.filename));

    probe.start();

    try
    {
        const target = await connect(probe, {
            underReset: true,
            halt: true,
            swdFrequencyHz: args.freq,
            trace: traceConfig,
        })

        console.log(`Target: ${target.description}`)

        const startTime = performance.now()
        const total = await program(target, image, args.preferred, operationLog(traceConfig))
        const elapsed = (performance.now() - startTime) / 1000

        traceConfig.informational?.(`Written: ${total} bytes from ${args.filename} (took ${elapsed}s).`)

        await disconnect(probe);
    }
    catch(e)
    {
        console.error(e)
        return -1
    }
    finally
    {
        probe.stop();
    }
    
    return 0;
}

main().then(ret => process.exit(ret))
