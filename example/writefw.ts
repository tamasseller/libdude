#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "--import" "tsx" "$0" "$@"

import { ProbeRegistry } from "../src/probe/registry";
import { summonUsbDevice } from "../src/probe/usb/summon";

const validTraces = ["interpreter", "memory", "dap", "packets"] as const;
type ValidTrace = typeof validTraces[number]

function isValidTrace(maybeValidTrace: unknown): maybeValidTrace is ValidTrace {
    return typeof maybeValidTrace === 'string' && validTraces.map(x => x as string).includes(maybeValidTrace);
}

function processArgs(argv: string[]): { serial?: string; dev?: { vid: number; pid: number; }; filename: string; }
{
    if (argv.length < 3) 
    {
        throw new Error(`Usage: ${argv[0]} <filename> [--dev vid:pid] [--serial serialNumber] [--freq value]`);
    }

    let opts: 
    {
        trace: (typeof validTraces[number])[];
        freq?: number;
        quiet: boolean;
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
    
async function main()
{
    const args = processArgs(process.argv)

    const dev = await summonUsbDevice(args.serial ?? args.dev ?? ProbeRegistry.allVidPids) 
    const probe = ProbeRegistry.build(dev)
    
    const target = connect(probe)
}

main()