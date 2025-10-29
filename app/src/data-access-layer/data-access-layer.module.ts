import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Session, SessionEvent } from './entities';
import { UserRepository, SessionRepository, SessionEventRepository } from './repositories';
import {
  IUserRepository,
  ISessionRepository,
  ISessionEventRepository,
} from '../domain/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session, SessionEvent])],
  providers: [
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: ISessionRepository,
      useClass: SessionRepository,
    },
    {
      provide: ISessionEventRepository,
      useClass: SessionEventRepository,
    },
  ],
  exports: [IUserRepository, ISessionRepository, ISessionEventRepository],
})
export class DataAccessLayerModule {}
