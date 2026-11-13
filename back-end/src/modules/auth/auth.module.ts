import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, type JwtSignOptions } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
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
