import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { DonHang } from "./don-hang.entity";
import { SanPham } from "../../san-pham/entities/san-pham.entity";

@Entity('chi_tiet_don_hang')
export class ChiTietDonHang {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @ManyToOne(() => DonHang)
    @JoinColumn({ name: 'id_don_hang' })
    idDonHang: Relation<DonHang>

    @ManyToOne(() => SanPham)
    @JoinColumn({ name: 'id_san_pham' })
    idSanPham: Relation<SanPham>

    @Column({ name: 'so_luong', type: 'int', unsigned: true })
    soLuong: number

    @Column({ name: 'don_gia', type: 'decimal', precision: 12, scale: 0 })
    donGia: number
}

