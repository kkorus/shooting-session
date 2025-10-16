import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Session, SessionEvent } from './entities';
import { UserRepository, SessionRepository, SessionEventRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session, SessionEvent])],
  providers: [UserRepository, SessionRepository, SessionEventRepository],
  exports: [UserRepository, SessionRepository, SessionEventRepository],
})
export class DataAccessLayerModule {}
