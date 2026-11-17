import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaiKhoan } from '../../tai-khoan/entities/tai-khoan.entities';

@Entity('ma_dat_lai_mat_khau')
export class MaDatLaiMatKhau {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @OneToOne(() => TaiKhoan, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_tai_khoan' })
    taiKhoan: TaiKhoan

    @Column({ name: 'ma_bam', type: 'varchar', length: 255 })
    maBam: string

    @Column({ name: 'het_han', type: 'datetime' })
    hetHan: Date

    @Column({ name: 'so_lan_sai', type: 'tinyint', unsigned: true, default: 0 })
    soLanSai: number

    @CreateDateColumn({ name: 'ngay_tao' })
    ngayTao: Date
}
