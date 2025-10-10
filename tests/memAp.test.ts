import test, { suite } from 'node:test';
import assert from 'node:assert';
import { format32 } from '../src/trace/format';
import { CSWMask } from '../src/data/adiRegisters';
import { WriteMemory, ReadMemory, WaitMemory } from '../src/operations/memoryAccess';
import { AhbLiteAp } from '../src/core/ahbLiteAp';

export function write8(address: number, value: number, done: () => void = () => { }, fail: (e: Error) => void): WriteMemory {
    assert(0 <= value && value <= 0xff);

    return new WriteMemory(address, Buffer.of(value), done, fail);
}

export function read8(address: number, done: (v: number) => void = () => { }, fail: (e: Error) => void): ReadMemory {
    return new ReadMemory(address, 1, v => done(v.readUInt8()), fail);
}

export function write16(address: number, value: number, done: () => void = () => { }, fail: (e: Error) => void): WriteMemory {
    assert(0 <= value && value <= 0xffff);
    assert(0 == (address & 1));

    const b = Buffer.alloc(2);
    b.writeUInt16LE(value);
    return new WriteMemory(address, b, done, fail);
}

export function read16(address: number, done: (v: number) => void = () => { }, fail: (e: Error) => void): ReadMemory {
    return new ReadMemory(address, 2, v => done(v.readUInt16LE()), fail);
}

export function write32(address: number, value: number, done: () => void = () => { }, fail: (e: Error) => void): WriteMemory {
    assert(0 <= value && value <= 4294967295);
    assert(0 == (address & 3));

    const b = Buffer.alloc(4);
    b.writeUInt32LE(value >>> 0);
    return new WriteMemory(address, b, done, fail);
}

export function read32(address: number, done: (v: number) => void = () => { }, fail: (e: Error) => void): ReadMemory {
    return new ReadMemory(address, 4, v => done(v.readUInt32LE()), fail);
}

suite("mem-ap", {}, () => {
    test("read8", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([read8(0x05, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x05)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `READ(1) AP0.DRW`
        ]
    ))

    test("read16", () => assert.deepEqual(
        (new AhbLiteAp(1).translate([read16(0x06, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP1.TAR <- ${format32(0x06)}`,
            `WRITE(1) AP1.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_16)}`,
            `READ(1) AP1.DRW`
        ]
    ))

    test("read32", () => assert.deepEqual(
        (new AhbLiteAp(2).translate([read16(0x08, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP2.TAR <- ${format32(0x08)}`,
            `WRITE(1) AP2.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_16)}`,
            `READ(1) AP2.DRW`
        ]
    ))

    test("readBlockSingleByte", () => assert.deepEqual(
        (new AhbLiteAp(3).translate([new ReadMemory(0x09, 1, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP3.TAR <- ${format32(0x09)}`,
            `WRITE(1) AP3.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `READ(1) AP3.DRW`
        ]
    ))

    test("readBlockHalfWordAligned", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([new ReadMemory(0x0a, 2, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x0a)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_16)}`,
            `READ(1) AP0.DRW`
        ]
    ))

    test("readBlockHalfWordMisaligned", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([new ReadMemory(0x0b, 2, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x0b)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_8)}`,
            `READ(1) AP0.DRW`,
            `READ(1) AP0.DRW`
        ]
    ))

    test("readBlockSingleWordAligned", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([new ReadMemory(0x0c, 4, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x0c)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_32)}`,
            `READ(1) AP0.DRW`
        ]
    ))

    test("readBlockSingleWordMisAligned", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([new ReadMemory(0x0d, 4, () => {}, (_) => {})])).map(x => x.toString()),
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
        (new AhbLiteAp(0).translate([new ReadMemory(0x0e, 5, () => {}, (_) => {})])).map(x => x.toString()),
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
        (new AhbLiteAp(0).translate([new ReadMemory(0x0f, 6, () => {}, (_) => {})])).map(x => x.toString()),
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
        (new AhbLiteAp(0).translate([write8(0x10, 0xa5, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x10)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x000000a5)}`
        ]
    ))

    test("write8lane1", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([write8(0x11, 0xa5, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x11)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x0000a500)}`
        ]
    ))

    test("write8lane2", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([write8(0x12, 0xa5, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x12)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00a50000)}`
        ]
    ))

    test("write8lane3", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([write8(0x13, 0xa5, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x13)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0xa5000000)}`
        ]
    ))

    test("write16lane01", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([write16(0x14, 0xb00b, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x14)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_16)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x0000b00b)}`
        ]
    ))

    test("write16lane23", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([write16(0x16, 0xb00b, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x16)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_16)}`,
            `WRITE(1) AP0.DRW <- ${format32(0xb00b0000)}`
        ]
    ))

    test("write32", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([write32(0x18, 0xb15b00b5, () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x18)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_32)}`,
            `WRITE(1) AP0.DRW <- ${format32(0xb15b00b5)}`
        ]
    ))

    test("writeBlockSingleByteAligned", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([new WriteMemory(0x20, Buffer.of(1), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x20)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00000001)}`
        ]
    ))

    test("writeBlockSingleByteMisAligned1", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([new WriteMemory(0x21, Buffer.of(1), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x21)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00000100)}`
        ]
    ))

    test("writeBlockSingleByteMisAligned2", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([new WriteMemory(0x22, Buffer.of(1), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x22)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00010000)}`
        ]
    ))

    test("writeBlockSingleByteMisAligned3", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([new WriteMemory(0x23, Buffer.of(1), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x23)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x01000000)}`
        ]
    ))

    test("writeBlockHalfWordAligned", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([new WriteMemory(0x24, Buffer.of(1, 2), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x24)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_16)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00000201)}`
        ]
    ))

    test("writeBlockHalfWordMisaligned", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([new WriteMemory(0x25, Buffer.of(1, 2), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x25)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00000100)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00020000)}`
        ]
    ))

    test("writeBlockAlignedWord", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([new WriteMemory(0x1234, Buffer.of(5, 6, 7, 8), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x1234)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_32)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x08070605)}`
        ]
    ))

    test("writeBlockMisalignedWord1", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([new WriteMemory(0x1235, Buffer.of(0x11, 0x22, 0x33, 0x44), () => {}, (_) => {})])).map(x => x.toString()),
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
        (new AhbLiteAp(0).translate([new WriteMemory(0x1236, Buffer.of(0x11, 0x22, 0x33, 0x44), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x1236)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_16)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x22110000)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00004433)}`,
        ]
    ))

    test("writeBlockMisalignedWord3", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([new WriteMemory(0x1237, Buffer.of(0x11, 0x22, 0x33, 0x44), () => {}, (_) => {})])).map(x => x.toString()),
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
        (new AhbLiteAp(0).translate([new WriteMemory(0x1238, Buffer.of(0x11, 0x22, 0x33, 0x44, 0x55), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x1238)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_32)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x44332211)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_8)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00000055)}`,
        ]
    ))

    test("writeBytesTail2", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([new WriteMemory(0x1238, Buffer.of(0x11, 0x22, 0x33, 0x44, 0x55, 0x66), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x1238)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_32)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x44332211)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_16)}`,
            `WRITE(1) AP0.DRW <- ${format32(0x00006655)}`,
        ]
    ))

    test("writeBytesTail3", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([new WriteMemory(0x1238, Buffer.of(0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77), () => {}, (_) => {})])).map(x => x.toString()),
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
        (new AhbLiteAp(0).translate([new WriteMemory(0x1238, Buffer.of(0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc), () => {}, (_) => {})])).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0x1238)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_32)}`,
            `WRITE(3) AP0.DRW <- ${format32(0x44332211)} ${format32(0x88776655)} ${format32(0xccbbaa99)}`,
        ]
    ))

    test("writeThreeWordsMisaligned1", () => assert.deepEqual(
        (new AhbLiteAp(0).translate([new WriteMemory(0x1239, Buffer.of(0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc), () => {}, (_) => {})])).map(x => x.toString()),
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
        (new AhbLiteAp(0).translate([new WriteMemory(0x123a, Buffer.of(0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc), () => {}, (_) => {})])).map(x => x.toString()),
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
        (new AhbLiteAp(0).translate([new WriteMemory(0x123b, Buffer.of(0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc), () => {}, (_) => {})])).map(x => x.toString()),
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
        new AhbLiteAp(0).translate([
            write32(0, 123, () => {}, (_) => {}),
            new WaitMemory(0, 456, 456, () => {}, (_) => {}),
        ]).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE_NO_INC | CSWMask.SIZE_32)}`,
            `WRITE(1) AP0.DRW <- ${format32(123)}`,
            `WAIT AP0.DRW & ${format32(456)} == ${format32(456)}`,
        ]
    ))

    test("randomWriteDifferent", () => assert.deepEqual(
        new AhbLiteAp(0).translate([
            write32(8, 123, () => {}, (_) => {}),
            write32(4, 456, () => {}, (_) => {}),
            write32(12, 789, () => {}, (_) => {}),
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
        new AhbLiteAp(0).translate([
            read32(8, () => {}, (_) => {}),
            write32(4, 123, () => {}, (_) => {}),
            write32(12, 456, () => {}, (_) => {}),
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
        new AhbLiteAp(0).translate([
            write32(0xe000edf8, 0xc007da7a, () => {}, (_) => {}),
            write32(0xe000edf4, 0x00010000, () => {}, (_) => {}),
            new WaitMemory(0xe000edf0, 0x00010000, 0x00010000, () => {}, (_) => {}),
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
        new AhbLiteAp(0).translate([
            write32(0xe000edf4, 0x00000000, () => {}, (_) => {}),
            new WaitMemory(0xe000edf0, 0x00010000, 0x00010000, () => {}, (_) => {}),
            read32(0xe000edf8, () => {}, (_) => {}),
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
        new AhbLiteAp(0).translate([
            write32(0xe000edf8, 0xc007da7a, () => {}, (_) => {}),
            write32(0xe000edf4, 0x00010000, () => {}, (_) => {}),
            new WaitMemory(0xe000edf0, 0x00010000, 0x00010000, () => {}, (_) => {}),
            write32(0xe000edf8, 0x1337c0de, () => {}, (_) => {}),
            write32(0xe000edf4, 0x00010001, () => {}, (_) => {}),
            new WaitMemory(0xe000edf0, 0x00010000, 0x00010000, () => {}, (_) => {}),
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
        new AhbLiteAp(0).translate([
            new ReadMemory(0xf000_0fd0, 48, () => {}, (_) => {}),
        ]).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0xf000_0fd0)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_32)}`,
            "READ(12) AP0.DRW"
        ]
    ))

    test("readRomTableRandom", () => assert.deepEqual(
        new AhbLiteAp(0).translate([
            read32(0xf000_0fd0, () => {}, (_) => {}),
            read32(0xf000_0fd4, () => {}, (_) => {}),
            read32(0xf000_0fd8, () => {}, (_) => {}),
            read32(0xf000_0fdc, () => {}, (_) => {}),
            read32(0xf000_0fe0, () => {}, (_) => {}),
            read32(0xf000_0fe4, () => {}, (_) => {}),
            read32(0xf000_0fe8, () => {}, (_) => {}),
            read32(0xf000_0fec, () => {}, (_) => {}),
            read32(0xf000_0ff0, () => {}, (_) => {}),
            read32(0xf000_0ff4, () => {}, (_) => {}),
            read32(0xf000_0ff8, () => {}, (_) => {}),
            read32(0xf000_0ffc, () => {}, (_) => {}),
        ]).map(x => x.toString()),
        [
            `WRITE(1) AP0.TAR <- ${format32(0xf000_0fd0)}`,
            `WRITE(1) AP0.CSW <- ${format32(CSWMask.VALUE | CSWMask.SIZE_32)}`,
            "READ(12) AP0.DRW",
        ]
    ))

    test("cross1kWrite", () => assert.deepEqual(
        new AhbLiteAp(0).translate([
            new WriteMemory(0x0800_03f8, Buffer.of(1, 2, 3, 4, 5, 6, 7, 8, 9), () => {}, (_) => {}),
        ]).map(x => x.toString()),
        [
            "WRITE(1) AP0.TAR <- 0x080003f8",
            "WRITE(1) AP0.CSW <- 0x23000052",
            "WRITE(2) AP0.DRW <- 0x04030201 0x08070605",
            "WRITE(1) AP0.TAR <- 0x08000400",
            "WRITE(1) AP0.CSW <- 0x23000040",
            "WRITE(1) AP0.DRW <- 0x00000009",
        ]
    ))

    test("cross1kRead", () => assert.deepEqual(
        new AhbLiteAp(0).translate([
            new ReadMemory(0x0800_03f8, 16, () => {}, (_) => {}),
        ]).map(x => x.toString()),
        [
            "WRITE(1) AP0.TAR <- 0x080003f8",
            "WRITE(1) AP0.CSW <- 0x23000052",
            "READ(2) AP0.DRW",
            "WRITE(1) AP0.TAR <- 0x08000400",
            "READ(2) AP0.DRW",
        ]
    ))

    test("crossMultiple1kWrite", () => assert.deepEqual(
        new AhbLiteAp(0).translate([
            new WriteMemory(0x2000_0000, Buffer.alloc(3 * 1024), () => {}, (_) => {}),
        ]).map(x => x.toString()),
        [
            "WRITE(1) AP0.TAR <- 0x20000000",
            "WRITE(1) AP0.CSW <- 0x23000052",
            "WRITE(256) AP0.DRW <- 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000",
            "WRITE(1) AP0.TAR <- 0x20000400",
            "WRITE(256) AP0.DRW <- 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000",
            "WRITE(1) AP0.TAR <- 0x20000800",
            "WRITE(256) AP0.DRW <- 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000 0x00000000",
        ]
    ))

    test("crossMultiple1kRead", () => assert.deepEqual(
        new AhbLiteAp(0).translate([
            new ReadMemory(0x2000_0000, 3 * 1024, () => {}, (_) => {}),
        ]).map(x => x.toString()),
        [
            "WRITE(1) AP0.TAR <- 0x20000000",
            "WRITE(1) AP0.CSW <- 0x23000052",
            "READ(256) AP0.DRW",
            "WRITE(1) AP0.TAR <- 0x20000400",
            "READ(256) AP0.DRW",
            "WRITE(1) AP0.TAR <- 0x20000800",
            "READ(256) AP0.DRW",
        ]
    ))
})