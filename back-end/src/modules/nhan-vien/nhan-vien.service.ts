import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { NhanVien } from './entities/nhan-vien.entities';
import { TaoNhanVienDTO } from './dto/tao-nhan-vien.dto';
import bcrypt from 'bcrypt'
import { TaiKhoan } from '../tai-khoan/entities/tai-khoan.entities';
import { CapNhanNhanVienDTO } from './dto/cap-nhat-nhan-vien.dto';
import { boGiaTriUndefined } from '../../common/utils/bo-gia-tri-undefined';
import { TrangThaiNhanVien } from '../../common/enums/trang-thai-nhan-vien.enum';
import { TrangThaiTaiKhoan } from '../../common/enums/trang-thai-tai-khoan.enum';
import { DatLaiMatKhauDTO } from './dto/dat-lai-mat-khau.dto';
import { VaiTro } from '../../common/enums/vai-tro.enum';
import { ViTri } from '../../common/enums/vi-tri.enum';
import { TrangThaiDonHang } from '../../common/enums/trang-thai-don-hang.enum';
import { TrangThaiBaoHanh } from '../../common/enums/trang-thai-bao-hanh.enum';
import { DonHang } from '../don-hang/entities/don-hang.entities';
import { BaoHanh } from '../bao-hanh/entities/bao-hanh.entities';

const NHAN_TRANG_THAI: Record<TrangThaiNhanVien, string> = {
  [TrangThaiNhanVien.HOAT_DONG]: 'đang làm việc',
  [TrangThaiNhanVien.NGHI_VIEC]: 'nghỉ việc',
}

@Injectable()
export class NhanVienService {
  constructor(
    @InjectRepository(NhanVien)
    private readonly nhanVienRepo: Repository<NhanVien>,
    private readonly dataSource: DataSource
  ) { }

  async timTatCaNhanVien() {
    const dsNhanVien = await this.nhanVienRepo.find({ relations: { taiKhoan: true }, order: { id: 'ASC' } })
    return dsNhanVien.map((nhanVien) => this.chuyenKetQua(nhanVien))
  }

  async taoNhanVien(dto: TaoNhanVienDTO) {
    const matKhauHash = await bcrypt.hash(dto.password, 10)

    try {
      return await this.dataSource.transaction(async (manager) => {
        const taiKhoan = await manager.save(TaiKhoan, {
          email: dto.email,
          password: matKhauHash,
          vaiTro: VaiTro.NHAN_VIEN
        })

        const nhanVien = await manager.save(NhanVien, {
          taiKhoan,
          hoTen: dto.hoTen,
          soDienThoai: dto.soDienThoai,
          viTri: dto.viTri
        })

        return this.chuyenKetQua(nhanVien)
      })
    } catch (error) {
      if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email đã được sử dụng')
      }
      throw error
    }
  }

  async capNhatNhanVien(id: number, dto: CapNhanNhanVienDTO) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const nhanVien = await manager.findOne(NhanVien, { where: { id }, relations: { taiKhoan: true } })

        if (!nhanVien) {
          throw new NotFoundException('Không tìm thấy nhân viên này')
        }

        const { email, trangThai, ...thongTin } = boGiaTriUndefined(dto)
        const doiViTri = thongTin.viTri !== undefined && thongTin.viTri !== nhanVien.viTri
        const choNghiViec = trangThai === TrangThaiNhanVien.NGHI_VIEC

        if (trangThai === nhanVien.trangThai) {
          throw new ConflictException(`Nhân viên này đã ở trạng thái "${NHAN_TRANG_THAI[trangThai]}" rồi`)
        }
        if (nhanVien.trangThai === TrangThaiNhanVien.NGHI_VIEC && trangThai !== TrangThaiNhanVien.HOAT_DONG && Object.keys(boGiaTriUndefined({ ...thongTin, email })).length > 0) {
          throw new ConflictException('Nhân viên đã nghỉ việc, hãy cho làm việc lại trước khi sửa thông tin')
        }
        if (doiViTri || choNghiViec) {
          await this.kiemTraKhongConViecDangLam(manager, nhanVien)
        }

        Object.assign(nhanVien, thongTin)

        if (email) {
          nhanVien.taiKhoan.email = email
        }

        if (trangThai) {
          nhanVien.trangThai = trangThai
          nhanVien.taiKhoan.trangThai = trangThai === TrangThaiNhanVien.HOAT_DONG ? TrangThaiTaiKhoan.HOAT_DONG : TrangThaiTaiKhoan.KHOA
        }

        await manager.save(nhanVien.taiKhoan)
        await manager.save(nhanVien)
        return this.chuyenKetQua(nhanVien)
      })
    } catch (error) {
      if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email đã được sử dụng')
      }
      throw error
    }
  }

  async datLaiMatKhau(id: number, dto: DatLaiMatKhauDTO) {
    const nhanVien = await this.nhanVienRepo.findOne({ where: { id }, relations: { taiKhoan: true } })

    if (!nhanVien) {
      throw new NotFoundException('Không tìm thấy nhân viên này')
    }
    if (nhanVien.trangThai === TrangThaiNhanVien.NGHI_VIEC) {
      throw new ConflictException('Nhân viên đã nghỉ việc, tài khoản đang bị khóa nên không đặt lại mật khẩu được')
    }

    const matKhauHash = await bcrypt.hash(dto.password, 10)
    await this.dataSource.manager.update(TaiKhoan, nhanVien.taiKhoan.id, { password: matKhauHash })
  }

  private async kiemTraKhongConViecDangLam(manager: EntityManager, nhanVien: NhanVien) {
    if (nhanVien.viTri === ViTri.BAN_HANG) {
      const soDon = await manager.count(DonHang, { where: { nhanVien: { id: nhanVien.id }, trangThai: In([TrangThaiDonHang.DA_XAC_NHAN, TrangThaiDonHang.DANG_GIAO]) } })
      if (soDon > 0) {
        throw new ConflictException(`Nhân viên còn ${soDon} đơn hàng đang xử lý (đã xác nhận hoặc đang giao), hãy hoàn tất trước`)
      }
    }
    if (nhanVien.viTri === ViTri.KY_THUAT) {
      const soPhieu = await manager.count(BaoHanh, { where: { nhanVien: { id: nhanVien.id }, trangThai: In([TrangThaiBaoHanh.TIEP_NHAN, TrangThaiBaoHanh.DANG_XU_LY]) } })
      if (soPhieu > 0) {
        throw new ConflictException(`Nhân viên còn ${soPhieu} phiếu bảo hành chưa xử lý xong, hãy hoàn tất trước`)
      }
    }
  }

  private chuyenKetQua(nhanVien: NhanVien) {
    return {
      id: nhanVien.id,
      hoTen: nhanVien.hoTen,
      soDienThoai: nhanVien.soDienThoai,
      viTri: nhanVien.viTri,
      trangThai: nhanVien.trangThai,
      ngayTao: nhanVien.ngayTao,
      email: nhanVien.taiKhoan.email
    }
  }
}
