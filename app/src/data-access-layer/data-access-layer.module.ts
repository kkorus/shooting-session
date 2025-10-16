import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Session, SessionEvent } from './entities';
import { UserRepository, SessionRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session, SessionEvent])],
  providers: [UserRepository, SessionRepository],
  exports: [UserRepository, SessionRepository],
})
export class DataAccessLayerModule {}
