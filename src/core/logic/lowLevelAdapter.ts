import * as adiDef from '../adi'
import * as memAp from '../ahbLiteAp'
import * as coreSight from '../coresight'

import * as mcu from '../target/mcu'
import * as target from '../target/identify'

import {  LinkDriverSetupOperation, ResetLineOperation, LinkTargetConnectOperation, UiOperation, LinkDriverShutdownOperation, Probe } from '../../probe/probe'

import { MemoryAccessScheduler } from '../scheduler'
import MemoryTracer from '../memory/trace'
import { ConnectOptions, DebugAdapter, Target, UiOptions } from '../debugAdapter'

export abstract class LowLevelAdapter implements DebugAdapter
{
    constructor(readonly log: UiOptions) {}

    public disconnect(): Promise<void>
    {
        return new Promise<void>((resolve, reject) => this.execute(
            new LinkDriverShutdownOperation(reject),
            new UiOperation({CONNECT: false}, reject, resolve)
        ))
    }
}
