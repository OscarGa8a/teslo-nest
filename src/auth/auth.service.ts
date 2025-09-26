import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    public readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);

      // Retornar el usuario sin la contraseña usando destructuring
      const { password: _, ...userWithoutPassword } = user;

      return {
        ...userWithoutPassword,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    return { ...user, token: this.getJwtToken({ id: user.id }) };
  }

  // async checkAuthStatus(user: User) {
  //   const userRepository = await this.userRepository.findOneBy({ id: user.id });

  //   if (!userRepository) throw new UnauthorizedException('Invalid userId');

  //   return {
  //     ...userRepository,
  //     token: this.getJwtToken({ id: user.id }),
  //   };
  // }

  checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async deleteAllUsers() {
    const query = this.userRepository.createQueryBuilder();
    // this.userRepository.deleteAll();

    try {
      await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBError(error);
    }
  }

  private handleDBError(error: any): never {
    this.logger.error(error);
    if (error.code === '23505') throw new BadRequestException(error.detail);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
