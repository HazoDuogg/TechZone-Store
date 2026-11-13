import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { SanPham } from "./san-pham.entity";
import { ChiTietDonHang } from "../../don-hang/entities/chi-tiet-don-hang.entity";

@Entity('chi_tiet_san_pham')
export class ChiTietSanPham {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @ManyToOne(() => SanPham)
    @JoinColumn({ name: 'id_san_pham' })
    idSanPham: Relation<SanPham>

    @ManyToOne(() => ChiTietDonHang, { nullable: true })
    @JoinColumn({ name: 'id_chi_tiet_don_hang' })
    idChiTietDonHang: Relation<ChiTietDonHang> | null

    @Column({ name: 'so_serial', type: 'varchar', length: 50 , unique: true })
    soSerial: string

    @Column({ name: 'trang_thai', type: 'enum', 
        enum: ['trong_kho', 'da_ban','dang_bao_hanh', 'loi'], default: 'trong_kho' })
    trangThai: 'trong_kho' | 'da_ban' | 'dang_bao_hanh' | 'loi'
    
    @CreateDateColumn({ name: 'ngay_nhap'})
    ngayNhap: Date
}