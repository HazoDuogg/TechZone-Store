import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { TaiKhoanService } from '../tai-khoan/tai-khoan.service';
import { JwtService } from '@nestjs/jwt';
import { DangNhapDTO } from './dto/dang-nhap.dto';
import bcrypt from 'bcrypt'
import { DangKyDTO } from './dto/dang-ky.dto';
import { DataSource } from 'typeorm';
import { TaiKhoan } from '../tai-khoan/entities/tai-khoan.entities';
import { VaiTro } from '../../common/enums/vai-tro.enum';
import { KhachHang } from '../khach-hang/entities/khach-hang.entities';
import { TrangThaiTaiKhoan } from '../../common/enums/trang-thai-tai-khoan.enum';
import { NhanVien } from '../nhan-vien/entities/nhan-vien.entities';
import { QuenMatKhauDTO } from './dto/quan-mat-khau.dto';
import { MaDatLaiMatKhau } from './entities/ma-dat-lai-mat-khau.entities';
import { randomInt } from 'crypto';
import { MailService } from '../mail/mail.service';
import { DatLaiMatKhauKhachDTO } from './dto/dat-lai-mat-khau-khach.dto';

const HAN_MA_PHUT = 10
const CHO_GUI_LAI_GIAY = 60
const SO_LAN_SAI_TOI_DA = 5

@Injectable()
export class AuthService {
    constructor(
        private readonly taiKhoanService: TaiKhoanService,
        private readonly jwtService: JwtService,
        private readonly dataSource: DataSource,
        private readonly mailService: MailService
    ) { }

    async dangNhap(dto: DangNhapDTO) {
        const taiKhoan = await this.taiKhoanService.timTheoEmail(dto.email)
        if (!taiKhoan || !(await bcrypt.compare(dto.password, taiKhoan.password))) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng')
        }

        if (taiKhoan.trangThai === TrangThaiTaiKhoan.KHOA) {
            throw new UnauthorizedException('Tài khoản của bạn đã bị khóa')
        }

        const accessToken = await this.jwtService.signAsync({
            sub: taiKhoan.id,
            vaiTro: taiKhoan.vaiTro
        })

        const hoSoTaiKhoan = taiKhoan.vaiTro === VaiTro.KHACH_HANG ? this.dataSource.getRepository(KhachHang) : this.dataSource.getRepository(NhanVien)
        const hoSo = await hoSoTaiKhoan?.findOne({ where: { taiKhoan: { id: taiKhoan.id } } })
        return {
            accessToken,
            taiKhoan: { id: taiKhoan.id, email: taiKhoan.email, vaiTro: taiKhoan.vaiTro, hoTen: hoSo?.hoTen, soDienThoai: hoSo?.soDienThoai, viTri: hoSo && 'viTri' in hoSo ? hoSo.viTri : undefined }
        }
    }

    async dangKy(dto: DangKyDTO) {
        const daCoTaiKhoan = await this.taiKhoanService.timTheoEmail(dto.email)
        if (daCoTaiKhoan) {
            throw new ConflictException('Email đã được sử dụng')
        }

        const matKhauHash = await bcrypt.hash(dto.password, 10)
        try {
            return await this.dataSource.transaction(async (manager) => {
                const taiKhoan = await manager.save(TaiKhoan, {
                    email: dto.email,
                    password: matKhauHash,
                    vaiTro: VaiTro.KHACH_HANG
                })

                await manager.save(KhachHang, {
                    taiKhoan,
                    hoTen: dto.hoTen,
                    soDienThoai: dto.soDienThoai
                })

                return {
                    id: taiKhoan.id,
                    email: taiKhoan.email
                }
            })
        } catch (error) {
            if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
                throw new ConflictException('Email đã được sử dụng')
            }
            throw error
        }
    }

    async quenMatKhau(dto: QuenMatKhauDTO) {
        const taiKhoan = await this.taiKhoanService.timTheoEmail(dto.email)

        if (!taiKhoan || taiKhoan.vaiTro !== VaiTro.KHACH_HANG || taiKhoan.trangThai === TrangThaiTaiKhoan.KHOA) {
            return
        }

        const repo = this.dataSource.getRepository(MaDatLaiMatKhau)
        const maCu = await repo.findOne({ where: { taiKhoan: { id: taiKhoan.id } } })

        if (maCu && Date.now() - maCu.ngayTao.getTime() < CHO_GUI_LAI_GIAY * 1000) {
            return
        }

        const ma = String(randomInt(0, 1_000_000)).padStart(6, '0')
        await repo.upsert(
            {
                taiKhoan: { id: taiKhoan.id },
                maBam: await bcrypt.hash(ma, 10),
                hetHan: new Date(Date.now() + HAN_MA_PHUT * 60 * 1000),
                soLanSai: 0,
                ngayTao: new Date()
            },
            ['taiKhoan']
        )
        await this.mailService.guiMaDatLaiMatKhau(taiKhoan.email, ma)
    }

    async datLaiMatKhau(dto: DatLaiMatKhauKhachDTO) {
        const taiKhoan = await this.taiKhoanService.timTheoEmail(dto.email)

        if (!taiKhoan || taiKhoan.vaiTro !== VaiTro.KHACH_HANG) {
            throw new BadRequestException('Mã không đúng hoặc đã hết hạn')
        }

        const repo = this.dataSource.getRepository(MaDatLaiMatKhau)
        const maLuu = await repo.findOne({ where: { taiKhoan: { id: taiKhoan.id } } })

        if (!maLuu || maLuu.hetHan < new Date() || maLuu.soLanSai >= SO_LAN_SAI_TOI_DA) {
            throw new BadRequestException('Mã không đúng hoặc đã hết hạn')
        }

        if (!(await bcrypt.compare(dto.ma, maLuu.maBam))) {
            await repo.increment({ id: maLuu.id }, 'soLanSai', 1)
            throw new BadRequestException('Mã không đúng hoặc đã hết hạn')
        }

        const matKhauHash = await bcrypt.hash(dto.matKhauMoi, 10)
        await this.dataSource.transaction(async (manager) => {
            await manager.update(TaiKhoan, taiKhoan.id, { password: matKhauHash })
            await manager.delete(MaDatLaiMatKhau, { id: maLuu.id })
        })
    }
}
