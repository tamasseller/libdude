#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "--import" "tsx" "$0" "$@"

import assert from "node:assert";
import { defaultTraceConfig, operationLog, TraceConfig } from "../src/trace/log";
import { ProbeDrivers } from "../src/probe/registry";
import { connect, disconnect } from "../src/core/connect";
import { readFileSync } from "node:fs";
import { Image } from "../src/target/storage/image";
import { program } from "../src/target/storage/program";

const validTraces = ["interpreter", "memory", "dap", "packets"] as const;
type ValidTrace = typeof validTraces[number]

function isValidTrace(maybeValidTrace: unknown): maybeValidTrace is ValidTrace {
    return typeof maybeValidTrace === 'string' && validTraces.map(x => x as string).includes(maybeValidTrace);
}

function processArgs(argv: string[]): { 
    filename: string; 
    quiet: boolean; 
    trace: ValidTrace[]; 
    dev?: { vid: number; pid: number; }; 
    serial?: string; 
    freq?: number; 
    preferred?: string;
} {
    if (argv.length < 3) 
    {
        throw new Error(`Usage: ${argv[0]} <filename> [--quiet] [--trace {trace channels,}] [--dev vid:pid] [--serial serialNumber] [--freq value] [--preferred write-method]`);
    }

    let opts: 
    {
        trace: (typeof validTraces[number])[];
        freq?: number;
        quiet: boolean;
        preferred?: string;
        serial?: string;
        dev?: { vid: number; pid: number; }; 
    } = {
        trace: [],
        quiet: false
    };

    let filename: string | undefined; 

    for (let i = 2; i < argv.length; i++) 
    {
        const arg = argv[i];

        if (!filename && !arg.startsWith("--")) 
        {
            filename = arg;
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

    if (!filename) 
    {
        throw new Error("Error: filename is required");
    }
    
    return {filename: filename, ...opts};
}

function assembleTraceConfig(args: { trace: ValidTrace[]; quiet: boolean; }): TraceConfig
{
    const ret = {...defaultTraceConfig};

    if(args.quiet) ret.informational = () => {}
    if (args.trace.includes("dap"))         ret.dapTrace          = msg => console.error(msg)
    if (args.trace.includes("interpreter")) ret.interpreterTrace  = msg => console.error(msg)
    if (args.trace.includes("memory"))      ret.memoryAccessTrace = msg => console.error(msg)
    if (args.trace.includes("packets"))     ret.packetTrace       = msg => console.error(msg)

    return ret;
}

function assembleSelector(
    args: {
        serial?: string; 
        dev?: { vid: number; pid: number; }; 
    }
)
{
    if(args.serial !== undefined) return args.serial
    if(args.dev !== undefined) return ProbeDrivers.find(args.dev.vid, args.dev.pid)
}

    
async function main(): Promise<number>
{
    const args = processArgs(process.argv)
    const traceConfig = assembleTraceConfig(args)
    const probe = await ProbeDrivers.summon(assembleSelector(args), traceConfig);
    assert(probe)

    const image = await Image.readElf(readFileSync(args.filename));

    probe.start();

    try
    {
        const target = await connect(probe)
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
