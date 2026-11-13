import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class AuthService {
    constructor(
        private readonly taiKhoanService: TaiKhoanService,
        private readonly jwtService: JwtService,
        private readonly dataSource: DataSource
    ) { }

    async dangNhap(dto: DangNhapDTO) {
        let hoTen: string | null = null
        let soDienThoai: string | null = null
        const taiKhoan = await this.taiKhoanService.timTheoEmail(dto.email)
        if (!taiKhoan) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng')
        }

        const matKhau = await bcrypt.compare(dto.password, taiKhoan.password)
        if (!matKhau) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng')
        }

        if (taiKhoan.trangThai === TrangThaiTaiKhoan.KHOA) {
            throw new UnauthorizedException('Tài khoản của bạn đã bị khóa')
        }

        const accessToken = await this.jwtService.signAsync({
            sub: taiKhoan.id,
            vaiTro: taiKhoan.vaiTro
        })

        if (taiKhoan.vaiTro === VaiTro.KHACH_HANG) {
            const ho = await this.dataSource.getRepository(KhachHang).findOne({ where: { taiKhoan: { id: taiKhoan.id } } })
            hoTen = ho?.hoTen ?? null
            soDienThoai = ho?.soDienThoai ?? null
        } else if (taiKhoan.vaiTro === VaiTro.NHAN_VIEN) {
            const ho = await this.dataSource.getRepository(NhanVien).findOne({ where: { taiKhoan: { id: taiKhoan.id } } })
            hoTen = ho?.hoTen ?? null
            soDienThoai = ho?.soDienThoai ?? null
        }

        return {
            accessToken,
            taiKhoan: { id: taiKhoan.id, email: taiKhoan.email, vaiTro: taiKhoan.vaiTro, hoTen, soDienThoai }
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
}
