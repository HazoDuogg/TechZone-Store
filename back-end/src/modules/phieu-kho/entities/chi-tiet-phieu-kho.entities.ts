import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { PhieuNhapXuat } from "./phieu-nhap-xuat.entities";
import { SanPham } from "../../san-pham/entities/san-pham.entities";

@Entity('chi_tiet_phieu_kho')
export class ChiTietPhieuKho {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @ManyToOne(() => PhieuNhapXuat)
    @JoinColumn({ name: 'id_phieu_nhap_xuat' })
    phieuNhapXuat: Relation<PhieuNhapXuat>

    @ManyToOne(() => SanPham)
    @JoinColumn({ name: 'id_san_pham' })
    sanPham: Relation<SanPham>

    @Column({ name: 'so_luong', type: 'int', unsigned: true })
    soLuong: number

    @Column({ name: 'ghi_chu', type: 'varchar', length: 255, nullable: true })
    ghiChu: string | null
}