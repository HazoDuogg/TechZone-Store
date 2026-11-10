import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common';
import { TaiKhoanService } from './modules/tai-khoan/tai-khoan.service';
import { TaiKhoanController } from './modules/tai-khoan/tai-khoan.controller';
import { TaiKhoanModule } from './modules/tai-khoan/tai-khoan.module';
import { AuthModule } from './modules/auth/auth.module';

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
    AuthModule
  ],
  controllers: [TaiKhoanController],
  providers: [TaiKhoanService],
})

export class AppModule { }
