export class Chunk 
{
    constructor(
        readonly data: Buffer,
        readonly base: number
    ){}

    public static makeAligned(size: number, address: number, data: Buffer): Chunk[] 
    {
        const ret: Chunk[] = [];
        const end = address + data.length;

        for (let offset = 0; offset < data.length;) {
            const chunkStart = address + offset;
            const pageEnd = (Math.floor(chunkStart / size) + 1) * size;
            const chunkEnd = Math.min(pageEnd, end);
            const chunkLen = chunkEnd - chunkStart;

            ret.push(new Chunk(
                data.subarray(offset, offset + chunkLen),
                chunkStart,
            ));

            offset = chunkEnd - address;
        }

        return ret;
    }
}
