import * as coresight from "../bits/coresight/coresight"
import * as adiDef from "../bits/adi/defs"
import MemoryAccessTranslator from "../bits/memory/translator"
import MemoryAccessor from "../../executor/interpreter/accessor"
import { ConnectOptions, Target, UiOptions } from "../debugAdapter";

export interface ApInfo
{
    apsel: number;
    idr: adiDef.AccessPortIdRegisterValue
    memAp?: {
        mat: MemoryAccessTranslator
        pidr?: coresight.PidrValue
        sysmem?: boolean
    }
}

export interface TargetInfo
{
    dapId: adiDef.Idcode;
    discoveredAps?: ApInfo[];
}

export interface TargetDriverBuilder
{
    readonly sysMemAp: MemoryAccessTranslator
    build(log: UiOptions, target: MemoryAccessor, opts: ConnectOptions): Promise<Target>
}

export interface TargetDriverFactory
{
    name: string
    wouldTake: (info: TargetInfo) => boolean
    prepare: (info: TargetInfo) => TargetDriverBuilder
}