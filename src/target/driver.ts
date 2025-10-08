import { Adapter } from "../core/adapter";
import { AccessPortIdRegisterValue, Idcode } from "../core/adi";
import { PidrValue } from "../core/coresight";
import { TraceConfig } from "../log";
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
        readonly build: (adapter: Adapter, opts: ConnectOptions) => Promise<T>
    ) {}
}