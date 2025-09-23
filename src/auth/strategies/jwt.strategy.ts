import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly configService: ConfigService,
  ) {
    super({
      // secretOrKey: configService.get<string>('JWT_SECRET'),
      // jwtFromRequest:
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;
    return { email } as User;
  }
}
