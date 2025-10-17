import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SessionRepository, UserRepository } from '../../data-access-layer/repositories';
import { Session } from '../../data-access-layer';
import { SessionEventRepository } from '../../data-access-layer/repositories/session-event.repository';
import { calculateScore } from '../helpers/calculateScore';
import { SESSION_EVENT_TYPES, SessionEventType } from '../../const';

export interface StartSessionParams {
  playerId: string;
  mode: string;
}

export interface SessionEventPayloadParams {
  hit: boolean;
  distance: number;
}

export interface GetLeaderboardParams {
  playerId: string;
  mode: string;
  limit?: number;
}

const DEFAULT_LIMIT = 50;

@Injectable()
export class ShootingSessionService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly sessionEventRepository: SessionEventRepository,
  ) {}

  public async getSessionById(sessionId: string, playerId: string): Promise<Session> {
    const session = await this.sessionRepository.getById(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.playerId !== playerId) {
      throw new ForbiddenException('Player is not authorized to access this session');
    }

    return session;
  }

  public async getLeaderboard(params: GetLeaderboardParams): Promise<Session[]> {
    const { playerId, mode, limit } = params;

    const sessions = await this.sessionRepository.getMany({
      playerId,
      mode,
      limit: limit ?? DEFAULT_LIMIT,
      isFinished: true,
    });
    return sessions;
  }

  public async startSession(params: StartSessionParams): Promise<string> {
    const { playerId, mode } = params;

    const user = await this.userRepository.getById(playerId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // todo, nice to have:
    // * verify if player has an open session

    const session = this.sessionRepository.createSession(playerId, mode);
    return session.id;
  }

  public async closeSession(sessionId: string, playerId: string): Promise<void> {
    const session = await this.sessionRepository.getById(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.playerId !== playerId) {
      throw new ForbiddenException('Player is not authorized to close this session');
    }

    if (session.finishedAt) {
      throw new BadRequestException('Session already closed');
    }

    const sessionEvents = await this.sessionEventRepository.getSessionEvents(sessionId, SessionEventType.SHOT, {
      hit: true,
      distance: true,
    });

    const { score } = calculateScore(sessionEvents.map((e) => ({ hit: !!e.hit, distance: e.distance ?? 0 })));
    await this.sessionRepository.update(sessionId, { finishedAt: new Date(), score });
  }

  public async createSessionEvent(
    sessionId: string,
    playerId: string,
    type: SessionEventType,
    timestamp: Date,
    payload: SessionEventPayloadParams,
  ): Promise<void> {
    if (!SESSION_EVENT_TYPES.includes(type)) {
      throw new BadRequestException('Invalid event type');
    }

    const session = await this.sessionRepository.getById(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.playerId !== playerId) {
      throw new ForbiddenException('Player is not authorized to create events for this session');
    }

    if (session.finishedAt) {
      throw new BadRequestException('Session already closed');
    }

    if (timestamp < session.startedAt) {
      throw new BadRequestException('Event timestamp is before session start time');
    }

    // todo, nice to have:
    // * verify if event timestamp is greater than last event timestamp

    this.sessionEventRepository.createSessionEvent(sessionId, type, timestamp, {
      hit: payload.hit,
      distance: payload.distance,
    });
  }
}
