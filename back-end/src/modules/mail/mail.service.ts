import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
    private readonly transporter: Transporter

    constructor(private readonly config: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: config.get<string>('MAIL_HOST'),
            port: Number(config.get('MAIL_PORT')),
            secure: Number(config.get('MAIL_PORT')) === 465,
            auth: { user: config.get<string>('MAIL_USER'), pass: config.get<string>('MAIL_PASSWORD') }
        })
    }

    guiMaDatLaiMatKhau(email: string, ma: string) {
        return this.transporter.sendMail({
            from: this.config.get<string>('MAIL_FROM'),
            to: email,
            subject: 'Mã đặt lại mật khẩu TechZone',
            text: `Mã đặt lại mật khẩu của bạn là: ${ma} \nMã có hiệu lực trong 10 phút. Nếu bạn không yêu cầu, hãy bỏ qua tin này`
        })
    }
}
