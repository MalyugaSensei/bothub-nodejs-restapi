import { JwtModule } from '@nestjs/jwt';

export const jwtProvider = JwtModule.register({
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: process.env.JWT_EXPIRED,
  },
});
