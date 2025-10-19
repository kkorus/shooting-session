import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ShootingSessionController } from './controllers';
import { DataAccessLayerModule } from '../data-access-layer';
import { JwtStrategy } from './strategies/jwt.strategy';
import {
  GetSessionHandler,
  GetLeaderboardHandler,
  StartSessionHandler,
  FinishSessionHandler,
  CreateSessionEventHandler,
} from './handlers';
import { ShootingSessionModule as ShootingSessionDomainModule } from '../shooting-session/shooting-session.module';
import { LoggerService } from './services';

const handlers = [
  // query handlers
  GetSessionHandler,
  GetLeaderboardHandler,
  // command handlers
  StartSessionHandler,
  FinishSessionHandler,
  CreateSessionEventHandler,
];

const strategies = [JwtStrategy];

const services = [LoggerService];

@Module({
  imports: [DataAccessLayerModule, PassportModule, ShootingSessionDomainModule],
  controllers: [ShootingSessionController],
  providers: [...strategies, ...handlers, ...services],
})
export class ShootingSessionModule {}
