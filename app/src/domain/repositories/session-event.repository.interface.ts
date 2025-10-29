import { SessionEvent } from '../entities';
import { SessionEventType } from '@const';

export interface GetSessionEventsOptions {
  hit?: boolean;
  distance?: boolean;
}

export interface ISessionEventRepository {
  getSessionEvents(
    sessionId: string,
    type: SessionEventType,
    options: GetSessionEventsOptions,
  ): Promise<SessionEvent[]>;
  save(event: SessionEvent): Promise<SessionEvent>;
  deleteAll(): Promise<void>;
}

export const ISessionEventRepository = Symbol('ISessionEventRepository');
