import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { SessionEvent } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SessionEventRepository {
  public constructor(
    @InjectRepository(SessionEvent) private readonly sessionEventRepository: Repository<SessionEvent>,
  ) {}

  public createSessionEvent(
    sessionId: string,
    type: string,
    timestamp: Date,
    payload: {
      hit: boolean;
      distance: number;
    },
  ): SessionEvent {
    const sessionEvent = this.sessionEventRepository.create({
      sessionId,
      type,
      ts: timestamp,
      hit: payload.hit,
      distance: payload.distance,
    });
    return sessionEvent;
  }
}
