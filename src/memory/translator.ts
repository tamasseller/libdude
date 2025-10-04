import { AdiOperation } from "../adi/adi";
import { MemoryAccess } from "./operations";

export interface MemoryAccessObserver {
    observeWritten(address: number, data: Buffer): void;
    observeRead(address: number, data: Buffer): void;
    observeWaited(address: number, mask: number, value: number): void;
}

export default interface MemoryAccessTranslator {
    translate(cmds: MemoryAccess[]): AdiOperation[];
}
