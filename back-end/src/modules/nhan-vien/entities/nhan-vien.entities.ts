import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { TaiKhoan } from "../../tai-khoan/entities/tai-khoan.entities";
import { ViTri } from "../../../common/enums/vi-tri.enum";

@Entity('nhan_vien')
export class NhanVien {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @OneToOne(() => TaiKhoan)
    @JoinColumn({ name: 'id_tai_khoan' })
    idTaiKhoan: Relation<TaiKhoan>

    @Column({ name: 'ho_ten', type: 'varchar', length: 100 })
    hoTen: string

    @Column({ name: 'so_dien_thoai', type: 'varchar', length: 15 })
    soDienThoai: string

    @Column({ name: 'vi_tri', type: 'enum', enum: ViTri })
    viTri: ViTri

    @Column({ name: 'trang_thai', type: 'enum', enum: ["hoat_dong", "nghi_viec"], default: "hoat_dong" })
    trangThai: "hoat_dong" | "nghi_viec"

    @CreateDateColumn({ name: 'ngay_tao' })
    ngayTao: Date
}
