import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ShootingSessionModule } from './shooting-session-api/shooting-session-api.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataAccessLayerModule, getTypeOrmConfig } from './data-access-layer';
import * as dotenv from 'dotenv';
import { CqrsModule } from '@nestjs/cqrs';

dotenv.config();

@Module({
  imports: [
    CqrsModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: (): TypeOrmModuleOptions => getTypeOrmConfig(true),
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env['JWT_SECRET'],
      signOptions: { expiresIn: '1d' },
    }),
    ShootingSessionModule,
    DataAccessLayerModule,
  ],
})
export class AppModule {}
