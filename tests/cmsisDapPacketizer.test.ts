import * as command from '../src/probe/cmsis-dap/command';
import { packetize } from '../src/probe/cmsis-dap/packetize';
import * as protocol from '../src/probe/cmsis-dap/protocol';

import test, { suite } from 'node:test';
import assert from 'node:assert';

function saniPacketize(cmds: command.Command[], maxPacketSize: number, canExecute: boolean): command.Command[]
{
    const ret = packetize(cmds, maxPacketSize, canExecute)

    ret.forEach(p => {
        if(!canExecute)
        {
            assert.notDeepEqual(p.code, protocol.CommandCode.EXECUTE_COMMANDS)
        }

        assert.ok(p.format().length <= maxPacketSize);
    })
    
    return ret;
}

suite("packetizer", {}, () => {
    test("infoPassthroughSanity", () => assert.deepStrictEqual(
        saniPacketize([new command.InfoCommand(protocol.InfoRequest.CAPABILITIES, () => {})], 64, false).map(x =>x.toString()),
        [
            `INFO 240`,
        ]
    ))

    test("transferPassthroughSanity", () => assert.deepStrictEqual(
        saniPacketize([new command.TransferCommand([
            command.TransferRequest.read(false, 0xc, (r: protocol.TransferResponse, data: number) => {})
        ])], 64, false).map(x =>x.toString()),
        [
            `XFER DP[0xc].read()`,
        ]
    ))

    test("transferMerge", () => assert.deepStrictEqual(
        saniPacketize([
            new command.TransferCommand([
                command.TransferRequest.read(false, 0xc, (r: protocol.TransferResponse, data: number) => {})
            ]),
            new command.TransferCommand([
                command.TransferRequest.write(false, 0x8, 0x123, (r: protocol.TransferResponse) => {})
            ]),
        ], 64, false).map(x =>x.toString()),
        [
            `XFER DP[0xc].read(), DP[0x8].write(0x00000123)`,
        ]
    ))

    test("transferMergeMultiple", () => assert.deepStrictEqual(
        saniPacketize([
            new command.TransferCommand([
                command.TransferRequest.read(false, 0xc, (r: protocol.TransferResponse, data: number) => {})
            ]),
            new command.TransferCommand([
                command.TransferRequest.write(false, 0x8, 0x123, (r: protocol.TransferResponse) => {})
            ]),
                        new command.TransferCommand([
                command.TransferRequest.write(false, 0x4, 0x456, (r: protocol.TransferResponse) => {})
            ]),
        ], 64, false).map(x =>x.toString()),
        [
            `XFER DP[0xc].read(), DP[0x8].write(0x00000123), DP[0x4].write(0x00000456)`,
        ]
    ))

    test("writeTransfersSplitInTwo", () => assert.deepStrictEqual(
        saniPacketize([new command.TransferCommand([
            command.TransferRequest.write(false, 0x8, 0x1, () => {}),
            command.TransferRequest.write(false, 0x8, 0x2, () => {}),
            command.TransferRequest.write(false, 0x8, 0x3, () => {}),
            command.TransferRequest.write(false, 0x8, 0x4, () => {})
        ])], 16, false).map(x =>x.toString()),
        [
            "XFER DP[0x8].write(0x00000001), DP[0x8].write(0x00000002)",
            "XFER DP[0x8].write(0x00000003), DP[0x8].write(0x00000004)",
        ]
    ))

    test("readTransfersSplitInTwo", () => assert.deepStrictEqual(
        saniPacketize([new command.TransferCommand([
            command.TransferRequest.read(false, 0x0, () => {}),
            command.TransferRequest.read(false, 0x4, () => {}),
            command.TransferRequest.read(false, 0x8, () => {}),
            command.TransferRequest.read(false, 0xc, () => {})
        ])], 16, false).map(x =>x.toString()),
        [
            "XFER DP[0x0].read(), DP[0x4].read(), DP[0x8].read()",
            "XFER DP[0xc].read()",
        ]
    ))

    test("mergeAndResplitTransfers", () => assert.deepStrictEqual(
        saniPacketize([
            new command.TransferCommand([
                command.TransferRequest.write(false, 0x8, 0x1, () => {}),
                command.TransferRequest.write(false, 0x8, 0x2, () => {}),
                command.TransferRequest.write(false, 0x8, 0x3, () => {}),
            ]),
            new command.TransferCommand([
                command.TransferRequest.write(false, 0x8, 0x4, () => {}),
            ]),
        ], 16, false).map(x =>x.toString()),
        [
            "XFER DP[0x8].write(0x00000001), DP[0x8].write(0x00000002)",
            "XFER DP[0x8].write(0x00000003), DP[0x8].write(0x00000004)",
        ]
    ))

    test("splitFillsPacket", () => assert.deepStrictEqual(
        saniPacketize([
            new command.TransferCommand([
                command.TransferRequest.write(false, 0x8, 0x1, () => {}),
                command.TransferRequest.write(false, 0x8, 0x2, () => {}),
                command.TransferRequest.write(false, 0x8, 0x3, () => {}),
            ]),
        ], 15, false).map(x =>x.toString()),
        [
            "XFER DP[0x8].write(0x00000001), DP[0x8].write(0x00000002)",
            "XFER DP[0x8].write(0x00000003)",
        ]
    ))


    test("mergeTransfersNoResplit", () => assert.deepStrictEqual(
        saniPacketize([
            new command.TransferCommand([
                command.TransferRequest.write(false, 0x8, 0x1, () => {}),
                command.TransferRequest.write(false, 0x8, 0x2, () => {}),
            ]),
            new command.TransferCommand([
                command.TransferRequest.read(false, 0x0, () => {}),
                command.TransferRequest.read(false, 0x4, () => {}),
            ]),
        ], 16, false).map(x =>x.toString()),
        [
            "XFER DP[0x8].write(0x00000001), DP[0x8].write(0x00000002), DP[0x0].read(), DP[0x4].read()",
        ]
    ))

    test("smallBlockReadNoSplit", () => assert.deepStrictEqual(
        saniPacketize([
            new command.ReadBlockCommand(false, 0x8, 2, () => {})
        ], 16, false).map(x =>x.toString()),
        [
            "RBLK DP[0x8] #2"
        ]
    ))

    test("smallBlockWriteNoSplit", () => assert.deepStrictEqual(
        saniPacketize([
            new command.WriteBlockCommand(false, 0x8, [1, 2], () => {})
        ], 16, false).map(x =>x.toString()),
        [
            "WBLK DP[0x8] <- 0x00000001 0x00000002"
        ]
    ))

    test("bigBlockReadSplit", () => assert.deepStrictEqual(
        saniPacketize([
            new command.ReadBlockCommand(false, 0x8, 4, () => {})
        ], 16, false).map(x =>x.toString()),
        [
            "RBLK DP[0x8] #3",
            "RBLK DP[0x8] #1"
        ]
    ))

    test("bigBlockWriteSplit", () => assert.deepStrictEqual(
        saniPacketize([
            new command.WriteBlockCommand(false, 0x8, [1, 2, 3, 4], () => {})
        ], 16, false).map(x =>x.toString()),
        [
            "WBLK DP[0x8] <- 0x00000001 0x00000002",
            "WBLK DP[0x8] <- 0x00000003 0x00000004",
        ]
    ))

    test("differentSplitNoAtomic", () => assert.deepStrictEqual(
        saniPacketize([
            new command.TransferCommand([
                command.TransferRequest.write(false, 0x8, 0x1, () => {}),
                command.TransferRequest.write(false, 0x8, 0x2, () => {}),
            ]),
            new command.ReadBlockCommand(false, 0x8, 2, () => {})
        ], 64, false).map(x =>x.toString()),
        [
            "XFER DP[0x8].write(0x00000001), DP[0x8].write(0x00000002)",
            "RBLK DP[0x8] #2",
        ]
    ))

    test("differentMergeWithAtomic", () => assert.deepStrictEqual(
        saniPacketize([
            new command.TransferCommand([
                command.TransferRequest.write(false, 0x8, 0x1, () => {}),
                command.TransferRequest.write(false, 0x8, 0x2, () => {}),
            ]),
            new command.ReadBlockCommand(false, 0x8, 2, () => {})
        ], 64, true).map(x =>x.toString()),
        [
            "EXEC XFER DP[0x8].write(0x00000001), DP[0x8].write(0x00000002); RBLK DP[0x8] #2",
        ]
    ))

    test("differentMergeSplitWithAtomic", () => assert.deepStrictEqual(
        saniPacketize([
            new command.TransferCommand([
                command.TransferRequest.write(false, 0x8, 0x1, () => {}),
                command.TransferRequest.write(false, 0x8, 0x2, () => {}),
            ]),
            new command.ReadBlockCommand(false, 0xc, 6, () => {})
        ], 30, true).map(x =>x.toString()),
        [
            "EXEC XFER DP[0x8].write(0x00000001), DP[0x8].write(0x00000002); RBLK DP[0xc] #5",
            "RBLK DP[0xc] #1",
        ]
    ))

    test("execSplitPointWalk0", () => assert.deepStrictEqual(
        saniPacketize([
            new command.TransferAbortCommand(),
            new command.TransferAbortCommand(),
            new command.WriteBlockCommand(false, 0xc, [1, 2], () => {})
        ], 17, true).map(x =>x.toString()),
        [
            "EXEC XABR; XABR; WBLK DP[0xc] <- 0x00000001 0x00000002",
        ]
    ))

    test("execSplitPointWalk1", () => assert.deepStrictEqual(
        saniPacketize([
            new command.TransferAbortCommand(),
            new command.TransferAbortCommand(),
            new command.TransferAbortCommand(),
            new command.WriteBlockCommand(false, 0xc, [1, 2], () => {})
        ], 17, true).map(x =>x.toString()),
        [
            "EXEC XABR; XABR; XABR; WBLK DP[0xc] <- 0x00000001",
            "WBLK DP[0xc] <- 0x00000002"
        ]
    ))

    test("execSplitPointWalk2", () => assert.deepStrictEqual(
        saniPacketize([
            new command.TransferAbortCommand(),
            new command.TransferAbortCommand(),
            new command.TransferAbortCommand(),
            new command.TransferAbortCommand(),
            new command.TransferAbortCommand(),
            new command.TransferAbortCommand(),
            new command.WriteBlockCommand(false, 0xc, [1, 2], () => {})
        ], 17, true).map(x =>x.toString()),
        [
            "EXEC XABR; XABR; XABR; XABR; XABR; XABR; WBLK DP[0xc] <- 0x00000001",
            "WBLK DP[0xc] <- 0x00000002",
        ]
    ))

    test("execSplitPointWalk3", () => assert.deepStrictEqual(
        saniPacketize([
            new command.TransferAbortCommand(),
            new command.TransferAbortCommand(),
            new command.TransferAbortCommand(),
            new command.TransferAbortCommand(),
            new command.TransferAbortCommand(),
            new command.TransferAbortCommand(),
            new command.TransferAbortCommand(),
            new command.WriteBlockCommand(false, 0xc, [1, 2], () => {})
        ], 16, true).map(x =>x.toString()),
        [
            "EXEC XABR; XABR; XABR; XABR; XABR; XABR; XABR",
            "WBLK DP[0xc] <- 0x00000001 0x00000002",
        ]
    ))

    test("execSplitMergeMultiple", () => assert.deepStrictEqual(
        saniPacketize([
            new command.ReadBlockCommand(false, 0x8, 4, () => {}),
            new command.WriteBlockCommand(false, 0xc, [1, 2, 3, 4], () => {})
        ], 17, true).map(x =>x.toString()),
        [
            "RBLK DP[0x8] #3",
            "EXEC RBLK DP[0x8] #1; WBLK DP[0xc] <- 0x00000001",
            "WBLK DP[0xc] <- 0x00000002 0x00000003 0x00000004",
        ]
    ))
})