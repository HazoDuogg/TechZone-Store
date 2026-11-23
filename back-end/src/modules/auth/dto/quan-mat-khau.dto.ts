import { IsEmail } from "class-validator";

export class QuenMatKhauDTO {
    @IsEmail()
    email: string
}