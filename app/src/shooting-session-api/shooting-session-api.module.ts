import { Module } from '@nestjs/common';
import { ShootingSessionController } from './controllers';
import { ShootingSessionService } from './services/shooting-session.service';
import { DataAccessLayerModule } from '../data-access-layer';

@Module({
  imports: [DataAccessLayerModule],
  controllers: [ShootingSessionController],
  providers: [ShootingSessionService],
})
export class ShootingSessionModule {}
