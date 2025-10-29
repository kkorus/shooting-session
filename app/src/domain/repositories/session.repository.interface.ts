import { Session } from '../entities';
import { SessionMode } from '@const';

export interface GetManySessionsParams {
  playerId: string;
  mode: SessionMode;
  limit: number;
  isFinished: boolean;
}

export interface ISessionRepository {
  getById(id: string): Promise<Session | null>;
  getMany(params: GetManySessionsParams): Promise<Session[]>;
  save(session: Session): Promise<Session>;
  deleteAll(): Promise<void>;
}

export const ISessionRepository = Symbol('ISessionRepository');
