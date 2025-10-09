import { CommandCode } from './protocol'
import { ExecuteCommands, TransferCommand, WriteBlockCommand, ReadBlockCommand, Command, TransferRequest, TransferBlockCommand } from './command'
import assert from 'assert'

const executeReqOverhead = new ExecuteCommands([]).requestLength()
const executeResOverhead = new ExecuteCommands([]).responseLength()
const transferReqOverhead = new TransferCommand([]).requestLength()
const transferResOverhead = new TransferCommand([]).responseLength()
const transferBlockReqOverhead = new WriteBlockCommand(false, 0, [], () => {}).requestLength()
assert(transferBlockReqOverhead == new ReadBlockCommand(false, 0, 0, () => {}).requestLength())
const transferBlockResOverhead = new WriteBlockCommand(false, 0, [], () => {}).responseLength()
assert(transferBlockResOverhead == new ReadBlockCommand(false, 0, 0, () => {}).responseLength())

function mergeAdjecentTransfers([first, second, ...rest]: Command[]): Command[]
{
    if(first === undefined) return []
    if(second === undefined) return [first]

    if(first?.code === CommandCode.TRANSFER && second?.code === CommandCode.TRANSFER)
    {
        return mergeAdjecentTransfers([
            new TransferCommand([
                ...(first as TransferCommand).reqs,
                ...(second as TransferCommand).reqs
            ]), 
            ...rest
        ]);
    }

    return [first, ...mergeAdjecentTransfers([second, ...rest])];
}

function splitTransfers(reqs: TransferRequest[], reqSpace: number, resSpace: number): [TransferRequest[], TransferRequest[]]
{
    let reqLenAcc = 0;
    let resLenAcc = 0;
    const take: TransferRequest[] = [];

    while(true)
    {
        const [first, ...rest] = reqs;
        const firstReqLen = first.tellRequestLength()
        const firstResLen = first.tellResponseLength()

        if(reqLenAcc + firstReqLen <= reqSpace
            && resLenAcc + firstResLen <= resSpace
        )
        {
            reqLenAcc += firstReqLen
            resLenAcc += firstResLen
            take.push(first)
            reqs = rest;
            continue
        }

        break;
    } 

    return [take, reqs]
}

export function formPackets(cmds: Command[], maxPacketSize: number, canExecute: boolean): Command[]
{
    if(!cmds.length)
    {
        return [];
    }

    const pkt: Command[] = [];
    let reqLenAcc = 0;
    let resLenAcc = 0;

    while((pkt.length == 0) || canExecute)
    {
        const [first, ...rest] = cmds;

        if(first !== undefined)
        {
            const reqLenAvailable = maxPacketSize - reqLenAcc - ((pkt.length >= 1) ? executeReqOverhead : 0)
            const resLenAvailable = maxPacketSize - resLenAcc - ((pkt.length >= 1) ? executeResOverhead : 0)
            const firstReqLen = first.requestLength()
            const firstResLen = first.responseLength()

            if( firstReqLen <= reqLenAvailable
                && firstResLen <= resLenAvailable)
            {
                pkt.push(first)
                cmds = rest;
                reqLenAcc += firstReqLen
                resLenAcc += firstResLen
                continue;
            }
            else if(first.code == CommandCode.TRANSFER 
                && transferReqOverhead < reqLenAvailable 
                && transferResOverhead < resLenAvailable)
            {
                const [take, leave] = splitTransfers(
                    (first as TransferCommand).reqs, 
                    reqLenAvailable - transferReqOverhead, 
                    resLenAvailable - transferResOverhead
                )

                assert(leave.length);

                if(take.length)
                {
                    pkt.push(new TransferCommand(take));
                    cmds = [new TransferCommand(leave), ...rest];
                }
            }
            else if(first.code == CommandCode.TRANSFER_BLOCK 
                && transferBlockReqOverhead < reqLenAvailable 
                && transferBlockResOverhead < resLenAvailable
            )
            {
                const bxfer = first as TransferBlockCommand;
                const [take, leave] = bxfer.split(
                    reqLenAvailable - transferBlockReqOverhead, 
                    resLenAvailable - transferBlockResOverhead
                )

                if(take)
                {
                    pkt.push(take);
                    cmds = [leave, ...rest];    
                }
            }
        }

        break;
    } 

    assert(pkt.length)

    return [
        pkt.length == 1 
            ? pkt[0] 
            : new ExecuteCommands(pkt), 
        ...formPackets(cmds, maxPacketSize, canExecute)
    ];
}

export function packetize(cmds: Command[], maxPacketSize: number, canExecute: boolean): Command[]
{
    return formPackets(mergeAdjecentTransfers(cmds), maxPacketSize, canExecute);
}