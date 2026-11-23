import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';
import { unlink } from 'fs/promises';
import { ChiAdmin } from '../../common/decorators/admin-decorator';
import { laAnh } from '../../common/utils/la-anh';

const THU_MUC_ANH = 'uploads'
const DUOI_THEO_LOAI: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }

@Controller('tai-anh')
export class TaiAnhController {
    @Post()
    @ChiAdmin()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: THU_MUC_ANH,
                filename: (_req, tep, tra) => tra(null, randomBytes(12).toString('hex') + '.' + DUOI_THEO_LOAI[tep.mimetype]),
            }),
            limits: { fileSize: 2 * 1024 * 1024, files: 1 },
            fileFilter: (_req, tep, tra) =>
                Object.hasOwn(DUOI_THEO_LOAI, tep.mimetype) ? tra(null, true) : tra(new BadRequestException('Chỉ nhận ảnh JPG, PNG hoặc WebP'), false),
        }),
    )
    async taiAnh(@UploadedFile() tep?: Express.Multer.File) {
        if (!tep) {
            throw new BadRequestException('Chưa chọn ảnh')
        }
        if (!(await laAnh(tep.path))) {
            await unlink(tep.path)
            throw new BadRequestException('Tệp không phải ảnh hợp lệ')
        }
        return { duongDan: THU_MUC_ANH + '/' + tep.filename }
    }
}
