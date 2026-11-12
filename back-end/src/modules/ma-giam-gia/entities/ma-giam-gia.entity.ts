import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { LoaiMaGiamGia } from "../../../common/enums/loai-ma-giam-gia.enum";

@Entity('ma_giam_gia')
export class MaGiamGia {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @Column({ name: 'ma', type: 'varchar', length: 30 })
    ma: string

    @Column({ name: 'loai', type: 'enum', enum: LoaiMaGiamGia })
    loaiMa: string

    @Column({ name: 'gia_tri', type: 'decimal', precision: 12, scale: 0 })
    giaTri: number

    @Column({ name: 'don_toi_thieu', type: 'decimal', precision: 12, scale: 0 })
    donToiThieu: number

    @CreateDateColumn({ name: 'ngay_het_han', nullable: true })
    ngayHetHan: Date

    @Column({ name: 'hoat_dong', type: 'tinyint', default: 1 })
    hoatDong: boolean
}
