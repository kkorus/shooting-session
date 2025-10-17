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

  public async getMany(params: {
    playerId: string;
    mode: string;
    limit: number;
    isFinished?: boolean;
  }): Promise<Session[]> {
    const rows = await this.sessionRepository
      .createQueryBuilder('session')
      .where('session.mode = :mode', { mode: params.mode })
      .andWhere('session.playerId = :playerId', { playerId: params.playerId })
      .andWhere(params.isFinished ? 'session.finishedAt IS NOT NULL' : 'session.finishedAt IS NULL')
      .orderBy('session.score', 'DESC')
      .addOrderBy('session.finishedAt', 'ASC')
      .addOrderBy('session.createdAt', 'ASC')
      .limit(params.limit)
      .select(['session.id', 'session.playerId', 'session.mode', 'session.score', 'session.finishedAt'])
      .getRawMany<Session>();
    return rows;
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
