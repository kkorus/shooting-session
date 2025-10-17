import { Module } from '@nestjs/common';
import { DataAccessLayerModule } from '../data-access-layer';
import { ShootingSessionService } from './services';

@Module({
  imports: [DataAccessLayerModule],
  providers: [ShootingSessionService],
  exports: [ShootingSessionService],
})
export class ShootingSessionModule {}
