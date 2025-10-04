function formatHex(v: number, pad: number): string {
    return "0x" + ("0".repeat(pad) + v.toString(16)).slice(-pad);
}

export function format32(v: number): string {
    return formatHex(v, 8)
}

export function format16(v: number): string {
    return formatHex(v, 4)
}

export function format8(v: number): string {
    return formatHex(v, 2)
}

export function bytes(buff: Buffer): string 
{
    const ret: string[] = [];

    for(const b of buff)
    {
        ret.push(("00" + (b >>> 0).toString(16)).slice(-2))
    }

    return ret.join(" ");
}