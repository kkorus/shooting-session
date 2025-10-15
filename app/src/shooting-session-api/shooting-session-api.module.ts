import { Module } from '@nestjs/common';
import { ShootingSessionController } from './controllers';
import { ShootingSessionService } from './services';

@Module({
  controllers: [ShootingSessionController],
  providers: [ShootingSessionService],
})
export class ShootingSessionModule {}
