import { DapOperation } from "../core/dap"

export abstract class ProbeOperation {}

export interface Probe
{
    start(): Promise<string>
    stop(): Promise<void>
    execute(ops: ProbeOperation[]): void
}

export class TransferOperation extends ProbeOperation
{
    constructor(readonly ops: DapOperation[]) { super() }
}

export abstract class LinkManagementOperation extends ProbeOperation
{
    constructor(readonly fail: (e: Error) => void) { super() }   
}

export class LinkDriverSetupOperation extends LinkManagementOperation
{
    constructor(
        readonly opts: {
            frequency?: number,
            [key: string]: any 
        },
        fail: (e: Error) => void) 
    {
        super(fail)
    }
}

export class LinkTargetConnectOperation extends LinkManagementOperation
{
    constructor(readonly targetId: number | undefined, fail: (e: Error) => void) {
        super(fail)
    }
}

export class LinkDriverShutdownOperation extends LinkManagementOperation 
{ 
    constructor(fail: (e: Error) => void) 
    {
        super(fail)
    }   
}

export class UiOperation extends LinkManagementOperation
{
    constructor(
        readonly args: {[key: string]: any }, 
        fail: (e: Error) => void, 
        readonly done?: () => void
    ) {
        super(fail)
    }
}

export class DelayOperation extends LinkManagementOperation
{
    constructor(readonly timeUs: number, fail: (e: Error) => void) {
        super(fail)
    }
}

export class ResetLineOperation extends LinkManagementOperation
{
    constructor(readonly assert: boolean, fail: (e: Error) => void) {
        super(fail)
    }
}
