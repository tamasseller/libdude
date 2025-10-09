import { ConnectOptions } from "../core/connect";
import { AccessPortIdRegisterValue, Idcode } from "../data/adiRegisters";
import { PidrValue } from "../data/coresight";
import { AdiExecutor } from "../operations/adiOperation";
import { Target } from "./target";

export interface ApInfo
{
    apsel: number;
    idr: AccessPortIdRegisterValue
    memAp?: {
        pidr?: PidrValue
        sysmem?: boolean
    }
}

export interface TargetInfo
{
    dapId: Idcode;
    discoveredAps?: ApInfo[];
}

export class TargetDriver<T extends Target>
{
    constructor(
        readonly name: string, 
        readonly match: (ti: TargetInfo) => boolean,
        readonly build: (adapter: AdiExecutor, opts: ConnectOptions) => Promise<T>
    ) {}
}