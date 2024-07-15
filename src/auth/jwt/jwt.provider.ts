import { JwtModule } from "@nestjs/jwt";
import { jwtConstatnts } from './constants'

export const jwtProvider =
    JwtModule.register({
        global: true,
        secret: jwtConstatnts.secret,
        signOptions: {
            expiresIn: '60m'
        }
    })
