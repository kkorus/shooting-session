import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ShootingSessionController } from './controllers';
import { DataAccessLayerModule } from '../data-access-layer';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GetSessionQuery, GetLeaderboardQuery } from './queries';
import { StartSessionCommand, FinishSessionCommand, CreateSessionEventCommand } from './commands';

const handlers = [
  // queries
  GetSessionQuery,
  GetLeaderboardQuery,
  // commands
  StartSessionCommand,
  FinishSessionCommand,
  CreateSessionEventCommand,
];

const strategies = [JwtStrategy];

@Module({
  imports: [DataAccessLayerModule, PassportModule, ShootingSessionModule],
  controllers: [ShootingSessionController],
  providers: [...strategies, ...handlers],
})
export class ShootingSessionModule {}
