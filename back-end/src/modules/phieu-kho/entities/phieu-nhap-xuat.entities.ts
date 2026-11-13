import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { NhanVien } from "../../nhan-vien/entities/nhan-vien.entities";
import { LoaiPhieuKho } from "../../../common/enums/loai-phieu-kho.enum";
import { ChiTietPhieuKho } from "./chi-tiet-phieu-kho.entities";

@Entity('phieu_nhap_xuat')
export class PhieuNhapXuat {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @ManyToOne(() => NhanVien)
    @JoinColumn({ name: 'id_nhan_vien' })
    nhanVien: Relation<NhanVien>

    @Column({ name: 'loai', type: 'enum', enum: LoaiPhieuKho })
    loai: LoaiPhieuKho

    @CreateDateColumn({ name: 'ngay_lap' })
    ngayLap: Date

    @Column({ name: 'ghi_chu', type: 'varchar', length: 255, nullable: true })
    ghiChu: string | null

    @OneToMany(() => ChiTietPhieuKho, (ct) => ct.phieuNhapXuat)
    chiTietPhieuKho: Relation<ChiTietPhieuKho[]>
}
