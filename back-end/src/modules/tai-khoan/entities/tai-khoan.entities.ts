import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { VaiTro } from "../../../common/enums/vai-tro.enum";
import { TrangThaiTaiKhoan } from "../../../common/enums/trang-thai-tai-khoan.enum";

@Entity('tai_khoan')
export class TaiKhoan {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @Column({ name: 'username', type: 'varchar', length: 50 })
    username: string

    @Column({ name: 'email', type: 'varchar', length: 100 })
    email: string

    @Column({ name: 'password', type: 'varchar', length: 255 })
    password: string

    @Column({ name: 'trang_thai', type: 'enum', enum: TrangThaiTaiKhoan })
    trangThai: string

    @Column({ name: 'vai_tro', type: 'enum', enum: VaiTro })
    vaiTro: VaiTro;
}
