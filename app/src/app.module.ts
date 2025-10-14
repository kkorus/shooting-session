import { Module } from '@nestjs/common';
import { ShootingSessionModule } from './shooting-session-api';

@Module({
  imports: [ShootingSessionModule],
})
export class AppModule {}
