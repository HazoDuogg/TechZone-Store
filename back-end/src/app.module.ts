import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common';
import { TaiKhoanModule } from './modules/tai-khoan/tai-khoan.module';
import { AuthModule } from './modules/auth/auth.module';
import { DanhMucModule } from './modules/danh-muc/danh-muc.module';
import { MaGiamGiaModule } from './modules/ma-giam-gia/ma-giam-gia.module';
import { BaoHanhModule } from './modules/bao-hanh/bao-hanh.module';
import { DonHangModule } from './modules/don-hang/don-hang.module';
import { KhachHangModule } from './modules/khach-hang/khach-hang.module';
import { NhanVienModule } from './modules/nhan-vien/nhan-vien.module';
import { PhieuKhoModule } from './modules/phieu-kho/phieu-kho.module';
import { SanPhamModule } from './modules/san-pham/san-pham.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false
      }),
    }),
    TaiKhoanModule,
    AuthModule,
    DanhMucModule,
    MaGiamGiaModule,
    BaoHanhModule,
    DonHangModule,
    KhachHangModule,
    NhanVienModule,
    PhieuKhoModule,
    SanPhamModule
  ],
})

export class AppModule { }
