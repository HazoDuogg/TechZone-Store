import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { SanPham } from "./san-pham.entities";

@Entity('anh_san_pham')
export class AnhSanPham {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @ManyToOne(() => SanPham)
    @JoinColumn({ name: 'id_san_pham' })
    sanPham: Relation<SanPham>

    @Column({ name: 'duong_dan', type: 'varchar', length: 255 })
    duongDan: string

    @Column({ name: 'anh_chinh', type: 'boolean', default: false })
    anhChinh: boolean

    @Column({ name: 'thu_tu', type: 'tinyint', unsigned: true, default: 1 })
    thuTu: number
}