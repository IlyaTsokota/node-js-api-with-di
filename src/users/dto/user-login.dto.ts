import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class UserLoginDto {
    @IsEmail({}, { message: 'Incorrect email!' })
    email: string;

    @IsStrongPassword()
    @IsString({ message: 'Password must be a string!' })
    @IsNotEmpty({ message: 'Password is empty!' })
    password: string;
}
