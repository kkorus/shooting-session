import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Session } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SessionRepository {
  public constructor(@InjectRepository(Session) private readonly sessionRepository: Repository<Session>) {}

  public createSession(playerId: string, mode: string): Session {
    const session = this.sessionRepository.create({
      playerId,
      mode,
    });
    return session;
  }

  public async deleteAll(): Promise<void> {
    await this.sessionRepository.delete({});
  }
}
