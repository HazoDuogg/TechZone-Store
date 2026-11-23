import { UseGuards, applyDecorators } from "@nestjs/common"
import { JwtAuthGuard } from "../guards/jwt-auth.guard"
import { VaiTroGuard } from "../guards/vai-tro.guard"
import { CanVaiTro } from "./vai-tro.decorator"
import { VaiTro } from "../enums/vai-tro.enum"

export const ChiAdmin = () => applyDecorators(
    UseGuards(JwtAuthGuard, VaiTroGuard),
    CanVaiTro([VaiTro.ADMIN])
)