import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('danh_muc')
export class DanhMuc {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
    id: number

    @Column({ name: 'ten', type: 'varchar', length: 100 })
    ten: string

    @Column({ name: 'mo_ta', type: 'varchar', length: 255, nullable: true })
    moTa: string | null

    @Column({ name: 'anh_dai_dien', type: 'varchar', length: 255, nullable: true })
    anhDaiDien: string | null
}