import { DapOperation } from '../dap'

import { Special } from '../../executor/program/statement'

export abstract class LinkOperation {}

export class TransferOperation extends LinkOperation
{
    constructor(readonly ops: DapOperation[]) { super() }
}

export abstract class LinkManagementOperation extends LinkOperation
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

export const delay = (timeUs: number, fail: (e: Error) => void = (e) => {throw e}) => 
    new Special(new DelayOperation(timeUs, fail))

export class ResetLineOperation extends LinkManagementOperation
{
    constructor(readonly assert: boolean, fail: (e: Error) => void) {
        super(fail)
    }
}

export const reset = (assert: boolean, fail: (e: Error) => void = (e) => {throw e}) => 
    new Special(new ResetLineOperation(assert, fail))