import { format32 } from "../format";
import * as mcu from "./mcu";

import { stm32g0 } from "../../stm32g0/stm32g0";

export const targetDriverFactories: mcu.TargetDriverFactory[] = 
[
    stm32g0
]

export async function identifyDevice(ti: mcu.TargetInfo, nameSelector?: string): Promise<mcu.TargetDriverBuilder>
{
    const rightName = nameSelector ? targetDriverFactories.filter(b => b.name.includes(nameSelector)) : targetDriverFactories
    const selected = rightName.filter(b => b.wouldTake(ti))  

    switch (selected.length) {
        case 0:
            throw `Unknown MCU with DAP idcode: ${format32(ti.dapId.raw)}}`;

        case 1:
            const maybeMcu = await selected[0].prepare(ti);

            if(maybeMcu === undefined)
            {
                throw `Identity validation (${selected[0].name}) failed for MCU with DAP idcode: ${format32(ti.dapId.raw)}}`;
            }

            return maybeMcu;            
            
        default:
            throw `Could not identify MCU with DAP idcode: ${format32(ti.dapId.raw)}, possibilities: ${selected.map(s => s.name).join(", ")}`;
    }
}