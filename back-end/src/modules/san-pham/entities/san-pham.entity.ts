import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { DanhMuc } from "../../danh-muc/entities/danh-muc.entities";

@Entity('san_pham')
export class SanPham {
    @PrimaryGeneratedColumn({name: 'id', type: 'int', unsigned: true})
    id: number

    @ManyToOne(() => DanhMuc)
    @JoinColumn({name: 'id_danh_muc'})
    idDanhMuc: Relation<DanhMuc>

    @Column({name: 'ten', type: 'varchar', length: 200})
    ten: string

    @Column({name: 'thuong_hieu', type: 'varchar', length: 100, nullable: true})
    thuongHieu: string | null

    @Column({name: 'gia', type: 'decimal', precision: 12, scale: 0})
    gia: number

    @Column({name: 'gia_niem_yet', type: 'decimal', precision: 12, scale: 0, nullable: true})
    giaNiemYet: number | null

    @Column({name: 'mo_ta', type: 'text', nullable: true})
    moTa: string | null

    @Column({name: 'thong_so', type: 'json', nullable: true})
    thongSo: Record<string, unknown> | null

    @Column({name: 'so_thang_bao_hanh', type: 'tinyint', unsigned: true, default: 12})
    soThangBaoHanh: number

    @Column({name: 'trang_thai', type: 'enum', enum: ["cho_bo_sung", "dang_ban", "ngung_ban"], default: "cho_bo_sung"})
    trangThai: "cho_bo_sung" | "dang_ban" | "ngung_ban"

}
