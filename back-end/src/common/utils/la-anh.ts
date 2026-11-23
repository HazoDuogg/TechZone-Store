import { open } from "fs/promises";

export async function laAnh(duongDan: string) {
    const tep = await open(duongDan, 'r')

    try {
        const { buffer } = await tep.read(Buffer.alloc(12), 0, 12, 0)
        const jpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
        const png = buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
        const webp = buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP'
        return jpeg || png || webp
    } finally {
        await tep.close()
    }
}