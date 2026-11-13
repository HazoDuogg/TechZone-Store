import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { ChiTietSanPham } from "../../san-pham/entities/chi-tiet-san-pham.entities";
import { NhanVien } from "../../nhan-vien/entities/nhan-vien.entities";

@Entity('bao_hanh')
export class BaoHanh {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @ManyToOne(() => ChiTietSanPham)
    @JoinColumn({ name: 'id_chi_tiet_san_pham' })
    chiTietSanPham: Relation<ChiTietSanPham>

    @ManyToOne(() => NhanVien, { nullable: true })
    @JoinColumn({ name: 'id_nhan_vien' })
    nhanVien: Relation<NhanVien> | null

    @Column({ name: 'mo_ta_loi', type: 'varchar', length: 500 })
    moTaLoi: string

    @Column({
        name: 'trang_thai', type: 'enum',
        enum: ['tiep_nhan', 'dang_xu_ly', 'hoan_tat', 'tu_choi'], default: 'tiep_nhan'
    })
    trangThai: 'tiep_nhan' | 'dang_xu_ly' | 'hoan_tat' | 'tu_choi'

    @Column({ name: 'ket_qua', type: 'varchar', length: 500, nullable: true })
    ketQua: string | null

    @CreateDateColumn({ name: 'ngay_tiep_nhan' })
    ngayTiepNhan: Date

    @Column({ name: 'ngay_hoan_thanh', type: 'datetime', nullable: true })
    ngayHoanThanh: Date | null
}
