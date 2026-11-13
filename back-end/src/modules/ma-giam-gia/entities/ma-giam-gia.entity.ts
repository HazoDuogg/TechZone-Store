import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { LoaiMaGiamGia } from "../../../common/enums/loai-ma-giam-gia.enum";

@Entity('ma_giam_gia')
export class MaGiamGia {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @Column({ name: 'ma', type: 'varchar', length: 30, unique: true })
    ma: string

    @Column({ name: 'loai', type: 'enum', enum: LoaiMaGiamGia })
    loaiMa: string

    @Column({ name: 'gia_tri', type: 'decimal', precision: 12, scale: 0 })
    giaTri: number

    @Column({ name: 'don_toi_thieu', type: 'decimal', precision: 12, scale: 0, default: 0 })
    donToiThieu: number

    @Column({ name: 'ngay_het_han', type: 'date', nullable: true })
    ngayHetHan: Date | null

    @Column({ name: 'hoat_dong', type: 'tinyint', default: 1 })
    hoatDong: boolean
}
