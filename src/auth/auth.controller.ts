import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testPrivate(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
  ) {
    return {
      ok: true,
      message: 'Hola mundo',
      user,
      userEmail,
      rawHeaders,
    };
  }

  @Get('private2')
  @SetMetadata('roles', ['admin', 'super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  testPrivate2(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Hola mundo private2',
      user,
    };
  }

  @Get('private3')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testPrivate3(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Hola mundo private3',
      user,
    };
  }

  @Get('private4')
  @Auth(ValidRoles.superUser)
  testPrivate4(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Hola mundo private4',
      user,
    };
  }
}
