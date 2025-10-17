import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env['JWT_SECRET'] as string,
    });
  }

  public async validate(payload: JwtPayload): Promise<{ playerId: string }> {
    if (!payload['playerId']) {
      throw new ForbiddenException('Missing playerId');
    }

    return { playerId: payload['playerId'] as string };
  }
}
