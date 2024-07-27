import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class LoginDto {
  @ValidateIf((login: LoginDto) => !login.username)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email?: string;

  @ValidateIf((login: LoginDto) => !login.email)
  @IsNotEmpty()
  @IsString()
  username?: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
