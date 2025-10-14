import { Module } from '@nestjs/common';
import { ShootingSessionController } from './shooting-session.controller';

@Module({
  controllers: [ShootingSessionController],
})
export class ShootingSessionModule {}
