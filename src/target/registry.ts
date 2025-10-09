import { format32 } from "../trace/format";
import { TargetDriver, TargetInfo } from "./driver";
import { Stm32g0 } from "./stm32g0/stm32g0";
import { Target } from "./target";

export class TargetDrivers
{
    public static stm32g0 = Stm32g0.driver

    public static get all(): TargetDriver<Target>[] 
    {
        const keys = Object.getOwnPropertyNames(TargetDrivers).filter(str => str !== "all");
        const vals = keys.map(key => (TargetDrivers as any)[key]);
        return vals.filter(val => val instanceof TargetDriver);
    }

    public static select(ti: TargetInfo, nameSelector?: string): TargetDriver<Target>
    {
        const rightName = nameSelector ? TargetDrivers.all.filter(b => b.name.includes(nameSelector)) : TargetDrivers.all
        const selected = rightName.filter(b => b.match(ti))  
    
        switch (selected.length) {
            case 0:
                throw `Unknown MCU with DAP idcode: ${format32(ti.dapId.raw)}}`;
    
            case 1:
                return selected[0]
                
            default:
                throw `Could not identify MCU with DAP idcode: ${format32(ti.dapId.raw)}, possibilities: ${selected.map(s => s.name).join(", ")}`;
        }
    }
}
