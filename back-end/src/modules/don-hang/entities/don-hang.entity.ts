import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { KhachHang } from "../../khach-hang/entities/khach-hang.entity";
import { NhanVien } from "../../nhan-vien/entities/nhan-vien.entity";
import { MaGiamGia } from "../../ma-giam-gia/entities/ma-giam-gia.entity";

@Entity('don_hang')
export class DonHang {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @Column ({ name: 'ma', type: 'varchar', length: 20, unique: true })
    ma: string

    @ManyToOne(() => KhachHang, { nullable: true })
    @JoinColumn({ name: 'id_khach_hang' })
    idKhachHang: Relation<KhachHang> | null

    @ManyToOne(() => NhanVien, { nullable: true })
    @JoinColumn({ name: 'id_nhan_vien' })
    idNhanVien: Relation<NhanVien> | null

    @ManyToOne(() => MaGiamGia, { nullable: true })
    @JoinColumn({ name: 'id_ma_giam_gia' })
    idMaGiamGia: Relation<MaGiamGia> | null

    @Column ({ name: 'ten_nguoi_nhan', type: 'varchar', length: 100 })
    tenNguoiNhan: string

    @Column ({ name: 'so_dien_thoai', type: 'varchar', length: 15 })
    soDienThoai: string

    @Column ({ name: 'email', type: 'varchar', length: 100, nullable: true })
    email: string | null

    @Column ({ name: 'dia_chi', type: 'varchar', length: 255})
    diaChi: string

    @Column ({ name: 'phi_van_chuyen', type: 'decimal', precision: 12, scale: 0, default: 0 })
    phiVanChuyen: number

    @Column ({ name: 'tien_giam', type: 'decimal', precision: 12, scale: 0, default: 0 })
    tienGiam: number

    @Column ({ name: 'trang_thai', type: 'enum', 
        enum: ['cho_xac_nhan', 'da_xac_nhan', 'dang_giao', 'hoan_tat', 'da_huy'], default: 'cho_xac_nhan' })
    trangThai: "cho_xac_nhan" | "da_xac_nhan" | "dang_giao" | "hoan_tat" | "da_huy"

    @CreateDateColumn({ name: 'ngay_dat' })
    ngayDat: Date

    @CreateDateColumn({ name: 'ngay_hoan_tat', nullable: true })
    ngayHoanTat: Date | null
}
