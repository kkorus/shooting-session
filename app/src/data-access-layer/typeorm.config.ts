import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../data-access-layer/entities/user.entity';
import { Session } from '../data-access-layer/entities/session.entity';
import { SessionEvent } from '../data-access-layer/entities/session-event.entity';

export const getTypeOrmConfig = (synchronize?: boolean, url?: string): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: url ?? process.env['DATABASE_URL'],
  entities: [User, Session, SessionEvent],
  synchronize: synchronize ?? false,
  logging: false,
});
