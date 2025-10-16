import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Session } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SessionRepository {
  public constructor(@InjectRepository(Session) private readonly sessionRepository: Repository<Session>) {}

  public getById(sessionId: string): Promise<Session | null> {
    return this.sessionRepository.findOne({ where: { id: sessionId } });
  }

  public createSession(playerId: string, mode: string): Session {
    const session = this.sessionRepository.create({
      playerId,
      mode,
    });
    return session;
  }

  public async update(sessionId: string, session: Partial<Pick<Session, 'finishedAt' | 'score'>>): Promise<void> {
    await this.sessionRepository.update(sessionId, session);
  }

  public async deleteAll(): Promise<void> {
    await this.sessionRepository.delete({});
  }
}
