import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 50)
  @Matches(/(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)/, {
    message:
      'La contraseña debe tener al menos una mayúscula, una minúscula y un número',
  })
  password: string;
}
