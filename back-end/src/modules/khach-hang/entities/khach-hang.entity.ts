import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { TaiKhoan } from "../../tai-khoan/entities/tai-khoan.entities";

@Entity('khach_hang')
export class KhachHang {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @OneToOne(() => TaiKhoan)
    @JoinColumn({ name: 'id_tai_khoan' })
    idTaiKhoan: Relation<TaiKhoan>

    @Column({ name: 'ho_ten', type: 'varchar', length: 100 })
    hoTen: string

    @Column({ name: 'so_dien_thoai', type: 'varchar', length: 15 })
    soDienThoai: string

    @Column({ name: 'ghi_chu', type: 'varchar', length: 255, nullable: true })
    ghiChu: string | null

    @CreateDateColumn({ name: 'ngay_tao' })
    ngayTao: Date
}
