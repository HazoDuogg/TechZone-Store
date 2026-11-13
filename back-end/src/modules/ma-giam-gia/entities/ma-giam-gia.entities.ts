import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { LoaiMaGiamGia } from "../../../common/enums/loai-ma-giam-gia.enum";
import { decimalTransformer } from "../../../common/transformers/decimal.transformer";

@Entity('ma_giam_gia')
export class MaGiamGia {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @Column({ name: 'ma', type: 'varchar', length: 30, unique: true })
    ma: string

    @Column({ name: 'loai', type: 'enum', enum: LoaiMaGiamGia })
    loai: LoaiMaGiamGia

    @Column({ name: 'gia_tri', type: 'decimal', precision: 12, scale: 0, transformer: decimalTransformer })
    giaTri: number

    @Column({ name: 'don_toi_thieu', type: 'decimal', precision: 12, scale: 0, default: 0, transformer: decimalTransformer })
    donToiThieu: number

    @Column({ name: 'ngay_het_han', type: 'date', nullable: true })
    ngayHetHan: string | null

    @Column({ name: 'hoat_dong', type: 'boolean', default: true })
    hoatDong: boolean
}
