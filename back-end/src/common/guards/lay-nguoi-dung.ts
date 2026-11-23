import { DataSource } from 'typeorm';
import { TaiKhoan } from '../../modules/tai-khoan/entities/tai-khoan.entities';
import { NhanVien } from '../../modules/nhan-vien/entities/nhan-vien.entities';
import { VaiTro } from '../enums/vai-tro.enum';
import { ViTri } from '../enums/vi-tri.enum';
import { TrangThaiTaiKhoan } from '../enums/trang-thai-tai-khoan.enum';

export async function layNguoiDungHienTai(dataSource: DataSource, idTaiKhoan: number) {
    const dong = await dataSource.getRepository(TaiKhoan).createQueryBuilder('tk')
        .leftJoin(NhanVien, 'nv', 'nv.id_tai_khoan = tk.id')
        .select('tk.vai_tro', 'vaiTro')
        .addSelect('tk.trang_thai', 'trangThai')
        .addSelect('nv.vi_tri', 'viTri')
        .where('tk.id = :idTaiKhoan', { idTaiKhoan })
        .getRawOne<{ vaiTro: VaiTro; trangThai: TrangThaiTaiKhoan; viTri: ViTri | null }>()

    if (!dong) {
        return null
    }
    return {
        nguoiDung: { sub: idTaiKhoan, vaiTro: dong.vaiTro, viTri: dong.viTri ?? undefined },
        biKhoa: dong.trangThai === TrangThaiTaiKhoan.KHOA,
    }
}
