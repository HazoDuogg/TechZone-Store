import { IsEmail, IsString, Length, Matches } from "class-validator";

export class QuenMatKhauDTO {
    @IsEmail()
    email: string
}