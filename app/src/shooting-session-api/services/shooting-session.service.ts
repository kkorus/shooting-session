import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SessionRepository, UserRepository } from '../../data-access-layer/repositories';
import { Session, SessionEvent } from '../../data-access-layer';
import { SessionEventRepository } from '../../data-access-layer/repositories/session-event.repository';
import { timestamp } from 'rxjs';
import { calculateScore } from '../helpers/calculateScore';

export interface StartSessionParams {
  playerId: string;
  mode: string;
}

export interface SessionEventPayloadParams {
  hit: boolean;
  distance: number;
}

@Injectable()
export class ShootingSessionService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly sessionEventRepository: SessionEventRepository,
  ) {}

  public async getSessionById(sessionId: string): Promise<Session> {
    const session = await this.sessionRepository.getById(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  public getLeaderboard(): void {}

  public async startSession(params: StartSessionParams): Promise<void> {
    const { playerId, mode } = params;

    const user = await this.userRepository.getById(playerId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.sessionRepository.createSession(playerId, mode);
  }

  public async closeSession(sessionId: string): Promise<void> {
    const session = await this.sessionRepository.getById(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const sessionEvents = await this.sessionEventRepository.getSessionEvents(sessionId, 'shot', {
      hit: true,
      distance: true,
    });

    const { score } = calculateScore(sessionEvents.map((e) => ({ hit: !!e.hit, distance: e.distance ?? 0 })));

    await this.sessionRepository.update(sessionId, { finishedAt: new Date(), score });
  }

  public async addSessionEvent(
    sessionId: string,
    type: string,
    timestamp: Date,
    payload: SessionEventPayloadParams,
  ): Promise<void> {
    const validEventTypes = ['shot']; // todo: add enum for event types
    if (!validEventTypes.includes(type)) {
      throw new BadRequestException('Invalid event type');
    }

    const session = await this.sessionRepository.getById(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // todo, nice to have:
    // * verify if event timestamp is greater than last event timestamp

    this.sessionEventRepository.createSessionEvent(sessionId, type, timestamp, {
      hit: payload.hit,
      distance: payload.distance,
    });
  }
}
