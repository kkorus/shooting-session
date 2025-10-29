import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Session as SessionEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../../domain/entities';
import {
  ISessionRepository,
  GetManySessionsParams,
} from '../../domain/repositories/session.repository.interface';
import { SessionMapper } from '../../infrastructure/mappers';

@Injectable()
export class SessionRepository implements ISessionRepository {
  public constructor(
    @InjectRepository(SessionEntity) private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  public async getById(sessionId: string): Promise<Session | null> {
    const entity = await this.sessionRepository.findOne({ where: { id: sessionId } });
    return entity ? SessionMapper.toDomain(entity) : null;
  }

  public async getMany(params: GetManySessionsParams): Promise<Session[]> {
    const entities = await this.sessionRepository
      .createQueryBuilder('session')
      .where('session.mode = :mode', { mode: params.mode })
      .andWhere('session.playerId = :playerId', { playerId: params.playerId })
      .andWhere(params.isFinished ? 'session.finishedAt IS NOT NULL' : 'session.finishedAt IS NULL')
      .orderBy('session.score', 'DESC')
      .addOrderBy('session.finishedAt', 'ASC')
      .addOrderBy('session.startedAt', 'ASC')
      .limit(params.limit)
      .getMany();

    return SessionMapper.toDomainArray(entities);
  }

  public async save(session: Session): Promise<Session> {
    const entity = SessionMapper.toEntity(session);
    const savedEntity = await this.sessionRepository.save(entity);
    return SessionMapper.toDomain(savedEntity);
  }

  public async deleteAll(): Promise<void> {
    await this.sessionRepository.clear();
  }
}
