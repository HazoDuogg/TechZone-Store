import { IsString, Length } from "class-validator";

export class DatLaiMatKhauDTO {
    @IsString()
    @Length(6, 100)
    password: string
}