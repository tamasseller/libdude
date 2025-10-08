export class Chunk 
{
    constructor(
        readonly data: Buffer,
        readonly base: number
    ){}

    padToAlign(size: number) 
    {
        const adjStart = Math.floor(this.base / size) * size
        const prePad = this.base - adjStart

        const end = this.base + this.data.length
        const adjEnd = Math.floor((end + size - 1) / size) * size
        const postPad = adjEnd - end

        return new Chunk(Buffer.concat([Buffer.alloc(prePad), this.data, Buffer.alloc(postPad)]), adjStart)
    }

    public sliceAligned(size: number): Chunk[] 
    {
        const ret: Chunk[] = [];
        const end = this.base + this.data.length;

        for (let offset = 0; offset < this.data.length;) 
        {
            const chunkStart = this.base + offset;
            const pageEnd = (Math.floor(chunkStart / size) + 1) * size;
            const chunkEnd = Math.min(pageEnd, end);
            const chunkLen = chunkEnd - chunkStart;

            ret.push(new Chunk(
                this.data.subarray(offset, offset + chunkLen),
                chunkStart,
            ));

            offset = chunkEnd - this.base;
        }

        return ret;
    }

    static consolidate(pieces: Chunk[]): Chunk 
    {
        const base = Math.min(...pieces.map(s => s.base))
        const end = Math.max(...pieces.map(s => s.base + s.data.byteLength))

        const data = Buffer.alloc((end - base))

        pieces.forEach(s => s.data.copy(data, s.base - base))  

        return new Chunk(data, base)
    }
}
