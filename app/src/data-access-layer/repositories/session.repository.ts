import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Session } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionMode } from '@const';

@Injectable()
export class SessionRepository {
  public constructor(@InjectRepository(Session) private readonly sessionRepository: Repository<Session>) {}

  public getById(sessionId: string): Promise<Session | null> {
    return this.sessionRepository.findOne({ where: { id: sessionId } });
  }

  public getMany(params: {
    playerId: string;
    mode: SessionMode;
    limit: number;
    isFinished?: boolean;
  }): Promise<Session[]> {
    return this.sessionRepository
      .createQueryBuilder('session')
      .where('session.mode = :mode', { mode: params.mode })
      .andWhere('session.playerId = :playerId', { playerId: params.playerId })
      .andWhere(params.isFinished ? 'session.finishedAt IS NOT NULL' : 'session.finishedAt IS NULL')
      .orderBy('session.score', 'DESC')
      .addOrderBy('session.finishedAt', 'ASC')
      .addOrderBy('session.startedAt', 'ASC')
      .limit(params.limit)
      .getMany();
  }

  public createSession(playerId: string, mode: SessionMode): Promise<Session> {
    return this.sessionRepository.save({
      playerId,
      mode,
    });
  }

  public async update(sessionId: string, session: Partial<Pick<Session, 'finishedAt' | 'score'>>): Promise<void> {
    await this.sessionRepository.update(sessionId, session);
  }

  public async deleteAll(): Promise<void> {
    await this.sessionRepository.clear();
  }
}
