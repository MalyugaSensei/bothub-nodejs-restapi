import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { AuthService } from "src/auth/auth.service";
import { IS_PUBLIC_KEY } from "src/auth/public.decorator";

export interface CustomRequest extends Request {
    user?: {
        id: string;
        username: string;
        role: number;
        [key: string]: any;
    };
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService,
        private readonly reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ])

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest<CustomRequest>();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Token missing');
        }

        try {
            const decoded = await this.authService.validateToken(token);
            request.user = {
                id: decoded.sub,
                ...decoded
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }

        return true
    }
}