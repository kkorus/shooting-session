import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ShootingSessionController } from './controllers';
import { ShootingSessionService } from './services/shooting-session.service';
import { DataAccessLayerModule } from '../data-access-layer';
import { JwtStrategy } from './strategies/jwt.strategy';
import { StartSessionHandler } from './handlers/start-session.handler';

const handlers = [StartSessionHandler];

@Module({
  imports: [DataAccessLayerModule, PassportModule],
  controllers: [ShootingSessionController],
  providers: [ShootingSessionService, JwtStrategy, ...handlers],
})
export class ShootingSessionModule {}
