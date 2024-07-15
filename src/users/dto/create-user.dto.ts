import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsString()
    readonly username: string;

    @IsString()
    @IsEmail()
    readonly email: string;

    @IsString()
    @IsStrongPassword()
    readonly password: string;

    readonly role?: number
}