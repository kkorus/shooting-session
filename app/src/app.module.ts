import { Module } from '@nestjs/common';
import { ShootingSessionModule } from './shooting-session-api/shooting-session-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataAccessLayerModule, typeOrmModuleOptions } from './data-access-layer';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmModuleOptions), ShootingSessionModule, DataAccessLayerModule],
})
export class AppModule {}
