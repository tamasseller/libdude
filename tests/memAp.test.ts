import { CSWMask } from '../src/adi/defs';
import * as memAp from '../src/memory/mem-ap';
import * as memOps from '../src/memory/operations';

import test, { suite } from 'node:test';
import assert from 'node:assert';
import { format32 } from '../src/format';

suite("mem-ap", {}, () => {
    test("read8", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([memOps.read8(0x05, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x05)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `READ(1) AP0.DRW`
        ]
    ))

    test("read16", () => assert.deepEqual(
        (new memAp.AhbLiteAp(1).translate([memOps.read16(0x06, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP1.TAR <- ${format32(0x06)}`,
            `WRITE(1) AP1.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_16)}`,
            `READ(1) AP1.DRW`
        ]
    ))

    test("read32", () => assert.deepEqual(
        (new memAp.AhbLiteAp(2).translate([memOps.read16(0x08, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP2.TAR <- ${format32(0x08)}`,
            `WRITE(1) AP2.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_16)}`,
            `READ(1) AP2.DRW`
        ]
    ))

    test("readBlockSingleByte", () => assert.deepEqual(
        (new memAp.AhbLiteAp(3).translate([new memOps.ReadMemory(0x09, 1, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP3.TAR <- ${format32(0x09)}`,
            `WRITE(1) AP3.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `READ(1) AP3.DRW`
        ]
    ))

    test("readBlockHalfWordAligned", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.ReadMemory(0x0a, 2, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x0a)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_16)}`,
            `READ(1) AP0.DRW`
        ]
    ))

    test("readBlockHalfWordMisaligned", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.ReadMemory(0x0b, 2, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x0b)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_8)}`,
            `READ(1) AP0.DRW`,
            `READ(1) AP0.DRW`
        ]
    ))

    test("readBlockSingleWordAligned", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.ReadMemory(0x0c, 4, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x0c)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_32)}`,
            `READ(1) AP0.DRW`
        ]
    ))

    test("readBlockSingleWordMisAligned", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.ReadMemory(0x0d, 4, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x0d)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_8)}`,
            `READ(1) AP0.DRW`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_16)}`,
            `READ(1) AP0.DRW`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `READ(1) AP0.DRW`,
        ]
    ))

    test("readBytes1", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.ReadMemory(0x0e, 5, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x0e)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_16)}`,
            `READ(1) AP0.DRW`,
            `READ(1) AP0.DRW`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `READ(1) AP0.DRW`
        ]
    ))

    test("readBytes2", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.ReadMemory(0x0f, 6, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x0f)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_8)}`,
            `READ(1) AP0.DRW`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_32)}`,
            `READ(1) AP0.DRW`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `READ(1) AP0.DRW`            
        ]
    ))

    test("write8lane0", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([memOps.write8(0x10, 0xa5, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x10)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x000000a5)}`
        ]
    ))

    test("write8lane1", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([memOps.write8(0x11, 0xa5, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x11)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x0000a500)}`
        ]
    ))

    test("write8lane2", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([memOps.write8(0x12, 0xa5, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x12)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00a50000)}`
        ]
    ))

    test("write8lane3", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([memOps.write8(0x13, 0xa5, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x13)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0xa5000000)}`
        ]
    ))

    test("write16lane01", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([memOps.write16(0x14, 0xb00b, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x14)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_16)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x0000b00b)}`
        ]
    ))

    test("write16lane23", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([memOps.write16(0x16, 0xb00b, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x16)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_16)}`,
            `WRITE(1) AP0.DRW <- ${format32(0xb00b0000)}`
        ]
    ))

    test("write32", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([memOps.write32(0x18, 0xb15b00b5, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x18)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_32)}`,
            `WRITE(1) AP0.DRW <- ${format32(0xb15b00b5)}`
        ]
    ))

    test("writeBlockSingleByteAligned", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.WriteMemory(0x20, Buffer.of(1), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x20)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00000001)}`
        ]
    ))

    test("writeBlockSingleByteMisAligned1", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.WriteMemory(0x21, Buffer.of(1), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x21)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00000100)}`
        ]
    ))

    test("writeBlockSingleByteMisAligned2", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.WriteMemory(0x22, Buffer.of(1), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x22)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00010000)}`
        ]
    ))

    test("writeBlockSingleByteMisAligned3", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.WriteMemory(0x23, Buffer.of(1), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x23)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x01000000)}`
        ]
    ))

    test("writeBlockHalfWordAligned", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.WriteMemory(0x24, Buffer.of(1, 2), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x24)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_16)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00000201)}`
        ]
    ))

    test("writeBlockHalfWordMisaligned", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.WriteMemory(0x25, Buffer.of(1, 2), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x25)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00000100)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00020000)}`
        ]
    ))

    test("writeBlockAlignedWord", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.WriteMemory(0x1234, Buffer.of(5, 6, 7, 8), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x1234)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_32)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x08070605)}`
        ]
    ))

    test("writeBlockMisalignedWord1", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.WriteMemory(0x1235, Buffer.of(0x11, 0x22, 0x33, 0x44), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x1235)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00001100)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_16)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x33220000)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00000044)}`,
        ]
    ))

    test("writeBlockMisalignedWord2", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.WriteMemory(0x1236, Buffer.of(0x11, 0x22, 0x33, 0x44), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x1236)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_16)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x22110000)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00004433)}`,
        ]
    ))

    test("writeBlockMisalignedWord3", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.WriteMemory(0x1237, Buffer.of(0x11, 0x22, 0x33, 0x44), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x1237)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x11000000)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_16)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00003322)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00440000)}`,
        ]
    ))

    test("writeBytesTail1", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.WriteMemory(0x1238, Buffer.of(0x11, 0x22, 0x33, 0x44, 0x55), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x1238)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_32)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x44332211)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00000055)}`,
        ]
    ))

    test("writeBytesTail2", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.WriteMemory(0x1238, Buffer.of(0x11, 0x22, 0x33, 0x44, 0x55, 0x66), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x1238)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_32)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x44332211)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_16)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00006655)}`,
        ]
    ))

    test("writeBytesTail3", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.WriteMemory(0x1238, Buffer.of(0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x1238)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_32)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x44332211)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_16)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00006655)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00770000)}`,
        ]
    ))

    test("writeThreeWordsAligned", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.WriteMemory(0x1238, Buffer.of(0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x1238)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_32)}`,
            `WRITE(3) AP0.DRW <- ${format32(0x44332211)} ${format32(0x88776655)} ${format32(0xccbbaa99)}`,
        ]
    ))

    test("writeThreeWordsMisaligned1", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.WriteMemory(0x1239, Buffer.of(0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x1239)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00001100)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_16)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x33220000)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_32)}`,
            `WRITE(2) AP0.DRW <- ${format32(0x77665544)} ${format32(0xbbaa9988)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x000000cc)}`,
        ]
    ))

    test("writeThreeWordsMisaligned2", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.WriteMemory(0x123a, Buffer.of(0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x123a)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_16)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x22110000)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_32)}`,
            `WRITE(2) AP0.DRW <- ${format32(0x66554433)} ${format32(0xaa998877)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_16)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x0000ccbb)}`,
        ]
    ))

    test("writeThreeWordsMisaligned3", () => assert.deepEqual(
        (new memAp.AhbLiteAp(0).translate([new memOps.WriteMemory(0x123b, Buffer.of(0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x123b)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x11000000)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_32)}`,
            `WRITE(2) AP0.DRW <- ${format32(0x55443322)} ${format32(0x99887766)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_16)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x0000bbaa)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00cc0000)}`,
        ]
    ))

    test("randomWriteWaitSame", () => assert.deepEqual(
        new memAp.AhbLiteAp(0).translate([
            memOps.write32(0, 123, () => {}, (_) => {}),
            new memOps.WaitMemory(0, 456, 456, () => {}, (_) => {}),
        ]).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_32)}`,
            `WRITE(1) AP0.DRW <- ${format32(123)}`,
            `WAIT AP0.DRW & ${format32(456)} == ${format32(456)}`,
        ]
    ))

    test("randomWriteDifferent", () => assert.deepEqual(
        new memAp.AhbLiteAp(0).translate([
            memOps.write32(8, 123, () => {}, (_) => {}),
            memOps.write32(4, 456, () => {}, (_) => {}),
            memOps.write32(12, 789, () => {}, (_) => {}),
        ]).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(4)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_32)}`,
            `WRITE(1) AP0.BD1 <- ${format32(123)}`,
            `WRITE(1) AP0.BD0 <- ${format32(456)}`,
            `WRITE(1) AP0.BD2 <- ${format32(789)}`,
        ]
    ))

    test("randomReadWriteDifferent", () => assert.deepEqual(
        new memAp.AhbLiteAp(0).translate([
            memOps.read32(8, () => {}, (_) => {}),
            memOps.write32(4, 123, () => {}, (_) => {}),
            memOps.write32(12, 456, () => {}, (_) => {}),
        ]).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(4)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_32)}`,
            `READ(1) AP0.BD1`,
            `WRITE(1) AP0.BD0 <- ${format32(123)}`,
            `WRITE(1) AP0.BD2 <- ${format32(456)}`,
        ]
    ))

    test("cmCoreRegWrite", () => assert.deepEqual(
        new memAp.AhbLiteAp(0).translate([
            memOps.write32(0xe000edf8, 0xc007da7a, () => {}, (_) => {}),
            memOps.write32(0xe000edf4, 0x00010000, () => {}, (_) => {}),
            new memOps.WaitMemory(0xe000edf0, 0x00010000, 0x00010000, () => {}, (_) => {}),
        ]).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0xe000edf0)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_32)}`,
            `WRITE(1) AP0.BD2 <- ${format32(0xc007da7a)}`,
            `WRITE(1) AP0.BD1 <- ${format32(0x00010000)}`,
            `WAIT AP0.BD0 & ${format32(0x00010000)} == ${format32(0x00010000)}`,
        ]
    ))

    test("cmCoreRegRead", () => assert.deepEqual(
        new memAp.AhbLiteAp(0).translate([
            memOps.write32(0xe000edf4, 0x00000000, () => {}, (_) => {}),
            new memOps.WaitMemory(0xe000edf0, 0x00010000, 0x00010000, () => {}, (_) => {}),
            memOps.read32(0xe000edf8, () => {}, (_) => {}),
        ]).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0xe000edf0)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_32)}`,
            `WRITE(1) AP0.BD1 <- ${format32(0x00000000)}`,
            `WAIT AP0.BD0 & ${format32(0x00010000)} == ${format32(0x00010000)}`,
            `READ(1) AP0.BD2`,
        ]
    ))

    test("cmCoreRegWriteMultiple", () => assert.deepEqual(
        new memAp.AhbLiteAp(0).translate([
            memOps.write32(0xe000edf8, 0xc007da7a, () => {}, (_) => {}),
            memOps.write32(0xe000edf4, 0x00010000, () => {}, (_) => {}),
            new memOps.WaitMemory(0xe000edf0, 0x00010000, 0x00010000, () => {}, (_) => {}),
            memOps.write32(0xe000edf8, 0x1337c0de, () => {}, (_) => {}),
            memOps.write32(0xe000edf4, 0x00010001, () => {}, (_) => {}),
            new memOps.WaitMemory(0xe000edf0, 0x00010000, 0x00010000, () => {}, (_) => {}),
        ]).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0xe000edf0)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_32)}`,
            `WRITE(1) AP0.BD2 <- ${format32(0xc007da7a)}`,
            `WRITE(1) AP0.BD1 <- ${format32(0x00010000)}`,
            `WAIT AP0.BD0 & ${format32(0x00010000)} == ${format32(0x00010000)}`,
            `WRITE(1) AP0.BD2 <- ${format32(0x1337c0de)}`,
            `WRITE(1) AP0.BD1 <- ${format32(0x00010001)}`,
            `WAIT AP0.BD0 & ${format32(0x00010000)} == ${format32(0x00010000)}`,
        ]
    ))

    test("readRomTable", () => assert.deepEqual(
        new memAp.AhbLiteAp(0).translate([
            new memOps.ReadMemory(0xf000_0fd0, 48, () => {}, (_) => {}),
        ]).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0xf000_0fd0)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_32)}`,
            "READ(12) AP0.DRW"
        ]
    ))

    test("readRomTableRandom", () => assert.deepEqual(
        new memAp.AhbLiteAp(0).translate([
            memOps.read32(0xf000_0fd0, () => {}, (_) => {}),
            memOps.read32(0xf000_0fd4, () => {}, (_) => {}),
            memOps.read32(0xf000_0fd8, () => {}, (_) => {}),
            memOps.read32(0xf000_0fdc, () => {}, (_) => {}),
            memOps.read32(0xf000_0fe0, () => {}, (_) => {}),
            memOps.read32(0xf000_0fe4, () => {}, (_) => {}),
            memOps.read32(0xf000_0fe8, () => {}, (_) => {}),
            memOps.read32(0xf000_0fec, () => {}, (_) => {}),
            memOps.read32(0xf000_0ff0, () => {}, (_) => {}),
            memOps.read32(0xf000_0ff4, () => {}, (_) => {}),
            memOps.read32(0xf000_0ff8, () => {}, (_) => {}),
            memOps.read32(0xf000_0ffc, () => {}, (_) => {}),
        ]).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0xf000_0fd0)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_32)}`,
            "READ(12) AP0.DRW",
        ]
    ))
})