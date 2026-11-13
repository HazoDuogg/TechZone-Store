import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { KhachHang } from "../../khach-hang/entities/khach-hang.entities";
import { NhanVien } from "../../nhan-vien/entities/nhan-vien.entities";
import { MaGiamGia } from "../../ma-giam-gia/entities/ma-giam-gia.entities";
import { decimalTransformer } from "../../../common/transformers/decimal.transformer";
import { TrangThaiDonHang } from "../../../common/enums/trang-thai-don-hang.enum";
import { ChiTietDonHang } from "./chi-tiet-don-hang.entities";

@Entity('don_hang')
export class DonHang {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @Column({ name: 'ma', type: 'varchar', length: 20, unique: true })
    ma: string

    @ManyToOne(() => KhachHang, { nullable: true })
    @JoinColumn({ name: 'id_khach_hang' })
    khachHang: Relation<KhachHang> | null

    @ManyToOne(() => NhanVien, { nullable: true })
    @JoinColumn({ name: 'id_nhan_vien' })
    nhanVien: Relation<NhanVien> | null

    @ManyToOne(() => MaGiamGia, { nullable: true })
    @JoinColumn({ name: 'id_ma_giam_gia' })
    maGiamGia: Relation<MaGiamGia> | null

    @Column({ name: 'ten_nguoi_nhan', type: 'varchar', length: 100 })
    tenNguoiNhan: string

    @Column({ name: 'so_dien_thoai', type: 'varchar', length: 15 })
    soDienThoai: string

    @Column({ name: 'email', type: 'varchar', length: 100, nullable: true })
    email: string | null

    @Column({ name: 'dia_chi', type: 'varchar', length: 255 })
    diaChi: string

    @Column({ name: 'phi_van_chuyen', type: 'decimal', precision: 12, scale: 0, default: 0, transformer: decimalTransformer })
    phiVanChuyen: number

    @Column({ name: 'tien_giam', type: 'decimal', precision: 12, scale: 0, default: 0, transformer: decimalTransformer })
    tienGiam: number

    @Column({
        name: 'trang_thai', type: 'enum',
        enum: TrangThaiDonHang, default: TrangThaiDonHang.CHO_XAC_NHAN
    })
    trangThai: TrangThaiDonHang

    @CreateDateColumn({ name: 'ngay_dat' })
    ngayDat: Date

    @Column({ name: 'ngay_hoan_tat', type: 'datetime', nullable: true })
    ngayHoanTat: Date | null

    @OneToMany(() => ChiTietDonHang, (ct) => ct.donHang)
    chiTietDonHang: Relation<ChiTietDonHang[]>
}
