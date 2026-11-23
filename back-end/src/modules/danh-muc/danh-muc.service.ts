import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DanhMuc } from './entities/danh-muc.entities';
import { Repository } from 'typeorm';
import { SanPham } from '../san-pham/entities/san-pham.entities';
import { TaoDanhMucDTO } from './dto/tao-danh-muc.dto';
import { CapNhatDanhMucDTO } from './dto/cap-nhat-danh-muc.dto';
import { boGiaTriUndefined } from '../../common/utils/bo-gia-tri-undefined';

@Injectable()
export class DanhMucService {
    constructor(
        @InjectRepository(DanhMuc)
        private readonly danhMucRepo: Repository<DanhMuc>
    ) { }

    async timTatCaDanhMuc() {
        const query = await this.danhMucRepo.createQueryBuilder('dm')
            .leftJoin(SanPham, 'sp', 'sp.id_danh_muc = dm.id')
            .select('dm.id', 'id')
            .addSelect('dm.ten', 'ten')
            .addSelect('dm.mo_ta', 'moTa')
            .addSelect('dm.anh_dai_dien', 'anhDaiDien')
            .addSelect('COUNT(sp.id)', 'soSanPham')
            .groupBy('dm.id')
            .orderBy('dm.id', 'ASC')
            .getRawMany<{ id: number; ten: string; moTa: string | null; anhDaiDien: string | null; soSanPham: string }>()

        return query.map((d) => ({ ...d, soSanPham: Number(d.soSanPham) }))
    }

    async taoDanhMuc(dto: TaoDanhMucDTO) {
        try {
            return await this.danhMucRepo.save(this.danhMucRepo.create(dto))
        } catch (error) {
            this.baoLoiTrungTen(error)
            throw error
        }
    }

    async capNhatDanhMuc(id: number, dto: CapNhatDanhMucDTO) {
        const danhMuc = await this.timDanhMucTheoId(id)
        Object.assign(danhMuc, boGiaTriUndefined(dto))

        try {
            return await this.danhMucRepo.save(danhMuc)
        } catch (error) {
            this.baoLoiTrungTen(error)
            throw error
        }
    }

    async xoaDanhMuc(id: number) {
        const danhMuc = await this.timDanhMucTheoId(id)
        try {
            await this.danhMucRepo.remove(danhMuc)
        } catch (error) {
            if ((error as { code?: string }).code === 'ER_ROW_IS_REFERENCED_2')
                throw new ConflictException('Danh mục đang có sản phẩm, không thể xóa')
            throw error
        }
    }

    private async timDanhMucTheoId(id: number) {
        const danhMuc = await this.danhMucRepo.findOneBy({ id })

        if (!danhMuc) {
            throw new NotFoundException('Không tìm thấy danh mục')
        }
        return danhMuc
    }

    private baoLoiTrungTen(error: unknown) {
        if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
            throw new ConflictException('Tên danh mục đã tồn tại')
        }
    }
}
