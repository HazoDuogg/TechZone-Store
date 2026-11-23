import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { PhieuKiemKe } from "./phieu-kiem-ke.entities";
import { SanPham } from "../../san-pham/entities/san-pham.entities";

@Entity('chi_tiet_kiem_ke')
export class ChiTietKiemKe {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @ManyToOne(() => PhieuKiemKe, (p) => p.chiTietKiemKe)
    @JoinColumn({ name: 'id_phieu_kiem_ke' })
    phieuKiemKe: Relation<PhieuKiemKe>

    @ManyToOne(() => SanPham)
    @JoinColumn({ name: 'id_san_pham' })
    sanPham: Relation<SanPham>

    @Column({ name: 'ton_he_thong', type: 'int', unsigned: true })
    tonHeThong: number

    @Column({ name: 'ton_thuc_te', type: 'int', unsigned: true })
    tonThucTe: number
}
