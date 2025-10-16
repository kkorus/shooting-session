import { Injectable, NotFoundException } from '@nestjs/common';
import { SessionRepository, UserRepository } from '../../data-access-layer/repositories';
import { Session } from '../../data-access-layer';

export interface StartSessionParams {
  playerId: string;
  mode: string;
}

@Injectable()
export class ShootingSessionService {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async getSessionById(sessionId: string): Promise<Session> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  public async startSession(params: StartSessionParams): Promise<void> {
    const { playerId, mode } = params;

    const user = await this.userRepository.findById(playerId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.sessionRepository.createSession(playerId, mode);
  }

  public async closeSession(sessionId: string): Promise<void> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await this.sessionRepository.update(sessionId, { finishedAt: new Date() });
  }
}
