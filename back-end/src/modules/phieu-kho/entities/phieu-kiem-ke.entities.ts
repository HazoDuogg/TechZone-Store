import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { NhanVien } from "../../nhan-vien/entities/nhan-vien.entities";
import { ChiTietKiemKe } from "./chi-tiet-kiem-ke.entities";

@Entity('phieu_kiem_ke')
export class PhieuKiemKe {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @ManyToOne(() => NhanVien)
    @JoinColumn({ name: 'id_nhan_vien' })
    nhanVien: Relation<NhanVien>

    @CreateDateColumn({ name: 'ngay_lap' })
    ngayLap: Date

    @Column({ name: 'ghi_chu', type: 'varchar', length: 255, nullable: true })
    ghiChu: string | null

    @OneToMany(() => ChiTietKiemKe, (ct) => ct.phieuKiemKe)
    chiTietKiemKe: Relation<ChiTietKiemKe[]>
}
