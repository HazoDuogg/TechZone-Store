import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { DonHang } from "./don-hang.entities";
import { SanPham } from "../../san-pham/entities/san-pham.entities";
import { decimalTransformer } from "../../../common/transformers/decimal.transformer";

@Entity('chi_tiet_don_hang')
export class ChiTietDonHang {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @ManyToOne(() => DonHang)
    @JoinColumn({ name: 'id_don_hang' })
    donHang: Relation<DonHang>

    @ManyToOne(() => SanPham)
    @JoinColumn({ name: 'id_san_pham' })
    sanPham: Relation<SanPham>

    @Column({ name: 'so_luong', type: 'int', unsigned: true })
    soLuong: number

    @Column({ name: 'don_gia', type: 'decimal', precision: 12, scale: 0, transformer: decimalTransformer })
    donGia: number
}

