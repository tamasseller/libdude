import { Pager } from '../src/core/pager';
import { DebugPort, MemoryAccessPort, CSWMask } from '../src/core/adi';

import test, { suite } from 'node:test';
import assert from 'node:assert';
import { format32 } from '../src/format';

suite("pager", {}, () => {
    test("readNonBankedDp", () => {
        assert.deepStrictEqual(
            (new Pager()).toDap([DebugPort.DPIDR.read(() => {}, (_) => {})]).map(x =>x.toString()),
            [
                `READ(1) DP[0x0]`,
            ]
        )
    })
    
    test("readBankedDp", () => {
        return assert.deepStrictEqual(
            (new Pager()).toDap([DebugPort.CTRL_STAT.read(() => { }, (_) => { })]).map(x => x.toString()),
            [
                `WRITE(1) DP[0x8] <- 0x00000000`,
                `READ(1) DP[0x4]`,
            ]
        );
    })
    
    test("readAp", () => {
        const map = new MemoryAccessPort(1);
        return assert.deepStrictEqual(
            (new Pager()).toDap([map.CSW.read(() => { }, (_) => { })]).map(x => x.toString()),
            [
                `WRITE(1) DP[0x8] <- 0x01000000`,
                `READ(1) AP1[0x0]`,
            ]
        );
    })
    
    test("writeAp", () => {
        const map = new MemoryAccessPort(2);
        return assert.deepStrictEqual(
            (new Pager()).toDap([map.TAR.write(0xb16b00b5, () => { }, (_) => { })]).map(x => x.toString()),
            [
                `WRITE(1) DP[0x8] <- 0x02000000`,
                `WRITE(1) AP2[0x4] <- 0xb16b00b5`,
            ]
        );
    })
    
    test("writeApSwitchBank", () => {
        const map = new MemoryAccessPort(3);
        return assert.deepStrictEqual(
            (new Pager()).toDap([
                map.TAR.write(0xb16b00b5, () => { }, (_) => { }),
                map.BD0.write(0xbabefeed, () => { }, (_) => { })
            ]).map(x => x.toString()),
            [
                `WRITE(1) DP[0x8] <- 0x03000000`,
                `WRITE(1) AP3[0x4] <- 0xb16b00b5`,
                `WRITE(1) DP[0x8] <- 0x03000010`,
                `WRITE(1) AP3[0x0] <- 0xbabefeed`,
            ]
        );
    })
    
    test("hoistApBank", () => {
        const map = new MemoryAccessPort(4);
        return assert.deepStrictEqual(
            (new Pager()).toDap([
                DebugPort.TARGETID.read(() => { }, (_) => { }),
                map.IDR.read(() => { }, (_) => { })
            ]).map(x => x.toString()),
            [
                `WRITE(1) DP[0x8] <- 0x040000f2`,
                `READ(1) DP[0x4]`,
                `READ(1) AP4[0xc]`,
            ]
        );
    })
    
    test("hoistDpBank", () => {
        const map = new MemoryAccessPort(5);
        return assert.deepStrictEqual(
            (new Pager()).toDap([
                map.IDR.read(() => { }, (_) => { }),
                DebugPort.TARGETID.read(() => { }, (_) => { })
            ]).map(x => x.toString()),
            [
                `WRITE(1) DP[0x8] <- 0x050000f2`,
                `READ(1) AP5[0xc]`,
                `READ(1) DP[0x4]`,
            ]
        );
    })
    
    test("cmCoreRegWrite", () => {
        const map = new MemoryAccessPort(6);
        return assert.deepStrictEqual(
            (new Pager()).toDap([
                map.TAR.write(0xe000edf0, () => { }, (_) => { }),
                map.CSW.write(CSWMask.VALUE | CSWMask.SIZE_32, () => { }, (_) => { }),
                map.BD2.write(0xc007da7a, () => { }, (_) => { }),
                map.BD1.write(0x00010000, () => { }, (_) => { }),
                map.BD0.wait(0x00010000, 0x00010000, () => { }, (_) => { }),
            ]).map(x => x.toString()),
            [
                `WRITE(1) DP[0x8] <- 0x06000000`,
                `WRITE(1) AP6[0x4] <- 0xe000edf0`,
                `WRITE(1) AP6[0x0] <- ${format32(CSWMask.VALUE | CSWMask.SIZE_32)}`,
                `WRITE(1) DP[0x8] <- 0x06000010`,
                `WRITE(1) AP6[0x8] <- 0xc007da7a`,
                `WRITE(1) AP6[0x4] <- 0x00010000`,
                `WAIT AP6[0x0] & 0x00010000 == 0x00010000`,
            ]
        );
    })
    
    test("cmCoreRegRead", () => {
        const map = new MemoryAccessPort(7);
        return assert.deepStrictEqual(
            (new Pager()).toDap([
                map.TAR.write(0xe000edf0, () => { }, (_) => { }),
                map.CSW.write(CSWMask.VALUE | CSWMask.SIZE_32, () => { }, (_) => { }),
                map.BD1.write(0x00000000, () => { }, (_) => { }),
                map.BD0.wait(0x00010000, 0x00010000, () => { }, (_) => { }),
                map.BD2.read(() => { }, (_) => { }),
            ]).map(x => x.toString()),
            [
                `WRITE(1) DP[0x8] <- 0x07000000`,
                `WRITE(1) AP7[0x4] <- 0xe000edf0`,
                `WRITE(1) AP7[0x0] <- ${format32(CSWMask.VALUE | CSWMask.SIZE_32)}`,
                `WRITE(1) DP[0x8] <- 0x07000010`,
                `WRITE(1) AP7[0x4] <- 0x00000000`,
                `WAIT AP7[0x0] & 0x00010000 == 0x00010000`,
                `READ(1) AP7[0x8]`,
            ]
        );
    })
    
    test("cmCoreRegWriteMultiple", () => {
        const map = new MemoryAccessPort(8);
        return assert.deepStrictEqual(
            (new Pager()).toDap([
                map.TAR.write(0xe000edf0, () => { }, (_) => { }),
                map.CSW.write(CSWMask.VALUE | CSWMask.SIZE_32, () => { }, (_) => { }),
                map.BD2.write(0xc007da7a, () => { }, (_) => { }),
                map.BD1.write(0x00010000, () => { }, (_) => { }),
                map.BD0.wait(0x00010000, 0x00010000, () => { }, (_) => { }),
                map.BD2.write(0x1337c0de, () => { }, (_) => { }),
                map.BD1.write(0x00010001, () => { }, (_) => { }),
                map.BD0.wait(0x00010000, 0x00010000, () => { }, (_) => { }),
            ]).map(x => x.toString()),
            [
                `WRITE(1) DP[0x8] <- 0x08000000`,
                `WRITE(1) AP8[0x4] <- 0xe000edf0`,
                `WRITE(1) AP8[0x0] <- ${format32(CSWMask.VALUE | CSWMask.SIZE_32)}`,
                `WRITE(1) DP[0x8] <- 0x08000010`,
                `WRITE(1) AP8[0x8] <- 0xc007da7a`,
                `WRITE(1) AP8[0x4] <- 0x00010000`,
                `WAIT AP8[0x0] & 0x00010000 == 0x00010000`,
                `WRITE(1) AP8[0x8] <- 0x1337c0de`,
                `WRITE(1) AP8[0x4] <- 0x00010001`,
                `WAIT AP8[0x0] & 0x00010000 == 0x00010000`,
            ]
        );
    })
})
