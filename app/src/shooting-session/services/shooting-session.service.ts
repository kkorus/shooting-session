import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Session, SessionEvent } from '../../domain/entities';
import { calculateScore } from '../helpers/calculate-score';
import { SESSION_EVENT_TYPES, SESSION_MODES, SessionEventType, SessionMode } from '../../const';
import { ISessionRepository, ISessionEventRepository, IUserRepository } from '../../domain/repositories';
import { SessionNotFoundError } from '../../domain/exceptions';

export interface StartSessionParams {
  playerId: string;
  mode: SessionMode;
}

export interface SessionEventPayloadParams {
  hit: boolean;
  distance: number;
}

export interface GetLeaderboardParams {
  playerId: string;
  mode: SessionMode;
  limit?: number;
}

const DEFAULT_LIMIT = 50;

@Injectable()
export class ShootingSessionService {
  public constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(ISessionRepository) private readonly sessionRepository: ISessionRepository,
    @Inject(ISessionEventRepository) private readonly sessionEventRepository: ISessionEventRepository,
  ) {}

  public async getSessionById(sessionId: string, playerId: string): Promise<Session> {
    const session = await this.sessionRepository.getById(sessionId);
    if (!session) {
      throw new SessionNotFoundError(sessionId);
    }

    session.ensureIsOwnedBy(playerId);

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

    if (!SESSION_MODES.includes(mode)) {
      throw new BadRequestException('Invalid session mode');
    }

    const userExists = await this.userRepository.exists(playerId);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    // todo, nice to have:
    // * verify if player has an open session

    const session = Session.create(playerId, mode);
    const savedSession = await this.sessionRepository.save(session);
    return savedSession.getId();
  }

  public async closeSession(sessionId: string, playerId: string): Promise<void> {
    const session = await this.sessionRepository.getById(sessionId);
    if (!session) {
      throw new SessionNotFoundError(sessionId);
    }

    session.ensureIsOwnedBy(playerId);
    session.ensureIsOpen();

    const sessionEvents = await this.sessionEventRepository.getSessionEvents(sessionId, SessionEventType.SHOT, {
      hit: true,
      distance: true,
    });

    const { score } = calculateScore(sessionEvents.map((e) => ({ hit: e.getHit(), distance: e.getDistance() ?? 0 })));
    session.close(score);

    await this.sessionRepository.save(session);
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
      throw new SessionNotFoundError(sessionId);
    }

    session.ensureIsOwnedBy(playerId);
    session.ensureIsOpen();
    session.validateEventTimestamp(timestamp);

    // todo, nice to have:
    // * verify if event timestamp is greater than last event timestamp

    const event = SessionEvent.create(sessionId, type, timestamp, {
      hit: payload.hit,
      distance: payload.distance,
    });

    await this.sessionEventRepository.save(event);
  }
}
