import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { DuLieuToken, YeuCauDaXacThuc } from "./jwt-auth.guard";

@Injectable()
export class JwtTuyChonGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const yeuCau = context.switchToHttp().getRequest<YeuCauDaXacThuc>()
        const [loai, token] = yeuCau.headers.authorization?.split(' ') ?? []

        if (loai === 'Bearer' && token) {
            try {
                yeuCau.user = await this.jwtService.verifyAsync<DuLieuToken>(token)
            } catch (error) { }
        }
        return true
    }
}