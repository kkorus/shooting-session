import { Injectable, NotFoundException } from '@nestjs/common';
import { SessionRepository, UserRepository } from '../../data-access-layer/repositories';

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

  public async startSession(params: StartSessionParams): Promise<void> {
    const { playerId, mode } = params;

    const user = await this.userRepository.findById(playerId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.sessionRepository.createSession(playerId, mode);
  }
}
