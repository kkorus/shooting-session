import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ShootingSessionModule } from '../../src/shooting-session-api/shooting-session-api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Session, SessionEvent } from '../../src/data-access-layer/entities';
import { DataAccessLayerModule } from '../../src/data-access-layer/data-access-layer.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Session, SessionEvent],
      synchronize: true,
      logging: false,
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ShootingSessionModule,
    DataAccessLayerModule,
  ],
})
export class TestAppModule {}
