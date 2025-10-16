import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../data-access-layer/entities/user.entity';
import { Session } from '../data-access-layer/entities/session.entity';
import { SessionEvent } from '../data-access-layer/entities/session-event.entity';

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env['DATABASE_URL'],
  entities: [User, Session, SessionEvent],
  synchronize: true,
  logging: false,
};

export const dataSourceOptions: DataSourceOptions = {
  ...(typeOrmModuleOptions as DataSourceOptions),
};

export const AppDataSource = new DataSource(dataSourceOptions);
