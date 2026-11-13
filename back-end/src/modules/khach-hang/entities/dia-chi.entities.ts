import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { KhachHang } from "./khach-hang.entities";

@Entity('dia_chi_giao_hang')
export class DiaChiGiaoHang {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @ManyToOne(() => KhachHang)
    @JoinColumn({ name: 'id_khach_hang' })
    khachHang: Relation<KhachHang>

    @Column({ name: 'ten_nguoi_nhan', type: 'varchar', length: 100 })
    tenNguoiNhan: string

    @Column({ name: 'so_dien_thoai', type: 'varchar', length: 15 })
    soDienThoai: string

    @Column({ name: 'dia_chi', type: 'varchar', length: 255 })
    diaChi: string

    @Column({ name: 'mac_dinh', type: 'boolean', default: false })
    macDinh: boolean
}