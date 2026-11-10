import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { VaiTro } from "../../../common/enums/vai-tro.enum";

@Entity('tai_khoan')
export class TaiKhoan {
    @PrimaryGeneratedColumn()
    private id: number

    @Column()
    private username: string

    @Column()
    private email: string

    @Column('mat_khau')
    private password: string

    @Column('trang_thai')
    private trangThai: string

    @Column('vai_tro')
    private vaiTro: VaiTro;
}
