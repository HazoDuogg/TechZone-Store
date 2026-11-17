import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, type JwtSignOptions } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';
import { TaiKhoanModule } from '../tai-khoan/tai-khoan.module';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaDatLaiMatKhau } from './entities/ma-dat-lai-mat-khau.entities';

@Module({
  imports: [
    TaiKhoanModule,
    MailModule,
    TypeOrmModule.forFeature([MaDatLaiMatKhau]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_ACCESS_EXPIRES_IN') as JwtSignOptions['expiresIn']
        }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
