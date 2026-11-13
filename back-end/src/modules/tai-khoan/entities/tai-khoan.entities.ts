import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { VaiTro } from "../../../common/enums/vai-tro.enum";
import { TrangThaiTaiKhoan } from "../../../common/enums/trang-thai-tai-khoan.enum";

@Entity('tai_khoan')
export class TaiKhoan {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
    email: string

    @Column({ name: 'mat_khau', type: 'varchar', length: 255 })
    password: string

    @Column({ name: 'vai_tro', type: 'enum', enum: VaiTro })
    vaiTro: VaiTro

    @Column({ name: 'trang_thai', type: 'enum', enum: TrangThaiTaiKhoan, default: TrangThaiTaiKhoan.HOAT_DONG })
    trangThai: TrangThaiTaiKhoan
}
