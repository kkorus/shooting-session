import { SessionEvent as SessionEventDomain } from '../../domain/entities';
import { SessionEvent as SessionEventEntity } from '../../data-access-layer/entities/session-event.entity';

export class SessionEventMapper {
  public static toDomain(entity: SessionEventEntity): SessionEventDomain {
    return SessionEventDomain.reconstitute(
      entity.id,
      entity.sessionId,
      entity.type,
      entity.ts,
      {
        hit: entity.hit,
        distance: entity.distance,
      },
      entity.createdAt,
    );
  }

  public static toEntity(domain: SessionEventDomain): SessionEventEntity {
    const entity = new SessionEventEntity();
    entity.id = domain.getId();
    entity.sessionId = domain.getSessionId();
    entity.type = domain.getType();
    entity.ts = domain.getTimestamp();
    entity.hit = domain.getHit();
    entity.distance = domain.getDistance();
    entity.createdAt = domain.getCreatedAt();
    return entity;
  }

  public static toDomainArray(entities: SessionEventEntity[]): SessionEventDomain[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
