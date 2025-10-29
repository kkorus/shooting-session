import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { SessionEvent as SessionEventEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEventType } from '../../const';
import { SessionEvent } from '../../domain/entities';
import {
  ISessionEventRepository,
  GetSessionEventsOptions,
} from '../../domain/repositories/session-event.repository.interface';
import { SessionEventMapper } from '../../infrastructure/mappers';

@Injectable()
export class SessionEventRepository implements ISessionEventRepository {
  public constructor(
    @InjectRepository(SessionEventEntity)
    private readonly sessionEventRepository: Repository<SessionEventEntity>,
  ) {}

  public async save(event: SessionEvent): Promise<SessionEvent> {
    const entity = SessionEventMapper.toEntity(event);
    const savedEntity = await this.sessionEventRepository.save(entity);
    return SessionEventMapper.toDomain(savedEntity);
  }

  public async getSessionEvents(
    sessionId: string,
    type: SessionEventType,
    options: GetSessionEventsOptions,
  ): Promise<SessionEvent[]> {
    const entities = await this.sessionEventRepository.find({
      where: { sessionId, type },
      order: { ts: 'ASC' },
      select: options as any,
    });

    return SessionEventMapper.toDomainArray(entities);
  }

  public deleteAll(): Promise<void> {
    return this.sessionEventRepository.clear();
  }
}
