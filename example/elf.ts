import { Chunk } from "./chunk";
import { format32 } from "./io";

export default class Image 
{
    constructor(
        readonly segments: Chunk[],
        readonly sections: Map<string, Buffer>
    ) {}

    public getSegmentsInRange(rstart: number, rsize: number): Chunk[] 
    {
        const rend = rstart + rsize
        return this.segments.filter(s => 
        {
            const sstart = s.base
            const send = sstart + s.data.byteLength

            if(rstart <= sstart && sstart < rend)
            {
                if(send <= rend)
                {
                    return true;
                }

                throw new Error(`Segment [${format32(sstart)} - ${format32(send)}] does not fit in range [${format32(rstart)} - ${format32(rend)}]`)
            }
            
            return false;
        })
    }

    static readElf(fileData: Buffer): Image
    {
        const elfHdr = ElfHeader.parse(fileData);
        const phdrs = [...elfHdr.programHeaderOffsets()].map(off => ProgramHeader.parse(fileData.subarray(off)))   
        const shdrs = [...elfHdr.sectionHeaderOffsets()].map(off => SectionHeader.parse(fileData.subarray(off)))
        const shstr = shdrs[elfHdr.shstrndx];
        const names = fileData.subarray(shstr.offset, shstr.offset + shstr.size)

        return new Image(
            phdrs.filter(ph => ph.filesz !== 0)
                .map(ph => new Chunk(fileData.subarray(ph.offset, ph.offset + ph.filesz), ph.paddr)), 
            new Map(shdrs.map(sh => [
                names.subarray(sh.nameIdx, names.indexOf(0, sh.nameIdx)).toString('ascii'),
                fileData.subarray(sh.offset, sh.offset + sh.size)
            ]))
        )
    }
}

class ElfHeader
{
    private constructor(
        readonly phoff: number,
        readonly phentsize: number,
        readonly phnum: number,
        readonly shoff: number,
        readonly shentsize: number,
        readonly shnum: number,
        readonly shstrndx: number
    ) {}

    *sectionHeaderOffsets()
    {
        const end = this.shoff + this.shnum * this.shentsize
        for (let off = this.shoff; off < end; off += this.shentsize) yield off
    }

    *programHeaderOffsets()
    {
        const end = this.phoff + this.phnum * this.phentsize
        for (let off = this.phoff; off < end; off += this.phentsize) yield off
    }
    
    public static parse(data: Buffer): ElfHeader
    {
        const magic1 = data.readUint8(0x00);
        const magic2 = data.readUint8(0x01);
        const magic3 = data.readUint8(0x02);
        const magic4 = data.readUint8(0x03);

        if (magic1 != 0x7f || magic2 != 0x45 || magic3 != 0x4c || magic4 != 0x46) {
            throw "not an ELF file"
        }

        const is32bit = data.readUint8(0x04) == 1;
        const isLE = data.readUint8(0x05) == 1;
        if (!is32bit || !isLE) throw "only 32bit little endian ELF is supported"

        const type = data.readUint16LE(0x10);
        if (type != 2) throw "ELF file is not an executable"

        const machine = data.readUint16LE(0x12);
        if (machine != 0x28) throw "ELF target is not ARM"

        const phoff = data.readUint32LE(0x1C);
        const phentsize = data.readUint16LE(0x2A);
        if (phentsize < 0x18) throw "ELF program header entry size is unexpectedly small"

        const phnum = data.readUint16LE(0x2C);
        const shoff = data.readUint32LE(0x20);
        const shentsize = data.readUint16LE(0x2E);
        if (shentsize < 0x18) throw "ELF section header entry size is unexpectedly small"

        const shnum = data.readUint16LE(0x30);
        const shstrndx = data.readUint16LE(0x32);
        if (shnum <= shstrndx) throw "ELF section header name section does not exist"

        return new ElfHeader(phoff, phentsize, phnum, shoff, shentsize, shnum, shstrndx)
    }
}

class SectionHeader
{
    private constructor(
        readonly nameIdx: number,
        readonly offset: number,
        readonly size: number
    ) {}

    public static parse(data: Buffer): SectionHeader
    {
        const nameIdx = data.readUint32LE(0x00)
        const offset = data.readUint32LE(0x10)
        const size = data.readUint32LE(0x14)
        return new SectionHeader(nameIdx, offset, size)
    }
}

class ProgramHeader
{
    constructor(
        readonly offset: number,
        readonly vaddr: number,
        readonly paddr: number,
        readonly filesz: number,
        readonly memsz: number,
    ){}

    static parse(data: Buffer): ProgramHeader
    {
        const offset = data.readUint32LE(0x04);
        const vaddr = data.readUint32LE(0x08);
        const paddr = data.readUint32LE(0x0C);
        const filesz = data.readUint32LE(0x10);
        const memsz = data.readUint32LE(0x14);
        return new ProgramHeader(offset, vaddr, paddr, filesz, memsz)
    }
}

