import { IsEmail, IsString, Length, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 50)
  @Matches(/(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)/, {
    message:
      'La contraseña debe tener al menos una mayúscula, una minúscula y un número',
  })
  password: string;

  @IsString()
  @MinLength(2)
  fullName: string;
}
