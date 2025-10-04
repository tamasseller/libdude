import * as coresight from "../coresight/coresight"
import { AccessPortIdRegisterValue, Idcode } from "../adi/adi"
import MemoryAccessTranslator from "../memory/translator"
import MemoryAccessor from "../../executor/interpreter/accessor"
import { ConnectOptions, Target, UiOptions } from "../debugAdapter";

export interface ApInfo
{
    apsel: number;
    idr: AccessPortIdRegisterValue
    memAp?: {
        mat: MemoryAccessTranslator
        pidr?: coresight.PidrValue
        sysmem?: boolean
    }
}

export interface TargetInfo
{
    dapId: Idcode;
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