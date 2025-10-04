import * as proto from './protocol'
import * as cmd from './command'
import assert from 'assert'

const executeReqOverhead = new cmd.ExecuteCommands([]).requestLength()
const executeResOverhead = new cmd.ExecuteCommands([]).responseLength()
const transferReqOverhead = new cmd.TransferCommand([]).requestLength()
const transferResOverhead = new cmd.TransferCommand([]).responseLength()
const transferBlockReqOverhead = new cmd.WriteBlockCommand(false, 0, [], () => {}).requestLength()
assert(transferBlockReqOverhead == new cmd.ReadBlockCommand(false, 0, 0, () => {}).requestLength())
const transferBlockResOverhead = new cmd.WriteBlockCommand(false, 0, [], () => {}).responseLength()
assert(transferBlockResOverhead == new cmd.ReadBlockCommand(false, 0, 0, () => {}).responseLength())

function mergeAdjecentTransfers([first, second, ...rest]: cmd.Command[]): cmd.Command[]
{
    if(first === undefined) return []
    if(second === undefined) return [first]

    if(first?.code === proto.CommandCode.TRANSFER && second?.code === proto.CommandCode.TRANSFER)
    {
        return mergeAdjecentTransfers([
            new cmd.TransferCommand([
                ...(first as cmd.TransferCommand).reqs,
                ...(second as cmd.TransferCommand).reqs
            ]), 
            ...rest
        ]);
    }

    return [first, ...mergeAdjecentTransfers([second, ...rest])];
}

function splitTransfers(reqs: cmd.TransferRequest[], reqSpace: number, resSpace: number): [cmd.TransferRequest[], cmd.TransferRequest[]]
{
    let reqLenAcc = 0;
    let resLenAcc = 0;
    const take: cmd.TransferRequest[] = [];

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

export function formPackets(cmds: cmd.Command[], maxPacketSize: number, canExecute: boolean): cmd.Command[]
{
    if(!cmds.length)
    {
        return [];
    }

    const pkt: cmd.Command[] = [];
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
            else if(first.code == proto.CommandCode.TRANSFER 
                && transferReqOverhead < reqLenAvailable 
                && transferResOverhead < resLenAvailable)
            {
                const [take, leave] = splitTransfers(
                    (first as cmd.TransferCommand).reqs, 
                    reqLenAvailable - transferReqOverhead, 
                    resLenAvailable - transferResOverhead
                )

                assert(leave.length);

                if(take.length)
                {
                    pkt.push(new cmd.TransferCommand(take));
                    cmds = [new cmd.TransferCommand(leave), ...rest];
                }
            }
            else if(first.code == proto.CommandCode.TRANSFER_BLOCK 
                && transferBlockReqOverhead < reqLenAvailable 
                && transferBlockResOverhead < resLenAvailable
            )
            {
                const bxfer = first as cmd.TransferBlockCommand;
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
            : new cmd.ExecuteCommands(pkt), 
        ...formPackets(cmds, maxPacketSize, canExecute)
    ];
}

export function packetize(cmds: cmd.Command[], maxPacketSize: number, canExecute: boolean): cmd.Command[]
{
    return formPackets(mergeAdjecentTransfers(cmds), maxPacketSize, canExecute);
}