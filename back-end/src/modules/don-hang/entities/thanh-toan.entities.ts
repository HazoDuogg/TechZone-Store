import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { DonHang } from "./don-hang.entities";
import { decimalTransformer } from "../../../common/transformers/decimal.transformer";

@Entity('thanh_toan')
export class ThanhToan {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @ManyToOne(() => DonHang)
    @JoinColumn({ name: 'id_don_hang' })
    donHang: Relation<DonHang>

    @Column({ name: 'phuong_thuc', type: 'enum', enum: ['cod', 'chuyen_khoan', 'the', 'vi_dien_tu'] })
    phuongThuc: 'cod' | 'chuyen_khoan' | 'the' | 'vi_dien_tu'

    @Column({ name: 'so_tien', type: 'decimal', precision: 12, scale: 0, transformer: decimalTransformer })
    soTien: number

    @Column({
        name: 'trang_thai', type: 'enum',
        enum: ['cho_thanh_toan', 'thanh_cong', 'that_bai', 'hoan_tien'], default: 'cho_thanh_toan'
    })
    trangThai: 'cho_thanh_toan' | 'thanh_cong' | 'that_bai' | 'hoan_tien'

    @Column({ name: 'ma_giao_dich', type: 'varchar', length: 50, nullable: true })
    maGiaoDich: string | null

    @Column({ name: 'ngay_thanh_toan', type: 'datetime', nullable: true })
    ngayThanhToan: Date | null
}