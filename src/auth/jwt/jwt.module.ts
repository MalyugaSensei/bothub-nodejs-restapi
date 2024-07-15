import { Module } from "@nestjs/common";
import { jwtProvider } from "src/auth/jwt/jwt.provider";

@Module({
    imports: [jwtProvider],
    exports: [jwtProvider],
})
export class JwtModule { }