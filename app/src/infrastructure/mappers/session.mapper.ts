import { Session as SessionDomain } from '../../domain/entities';
import { Session as SessionEntity } from '../../data-access-layer/entities/session.entity';

export class SessionMapper {
  public static toDomain(entity: SessionEntity): SessionDomain {
    return SessionDomain.reconstitute(
      entity.id,
      entity.playerId,
      entity.mode,
      entity.startedAt,
      entity.finishedAt,
      entity.score,
    );
  }

  public static toEntity(domain: SessionDomain): SessionEntity {
    const entity = new SessionEntity();
    entity.id = domain.getId();
    entity.playerId = domain.getPlayerId();
    entity.mode = domain.getMode();
    entity.startedAt = domain.getStartedAt();
    entity.finishedAt = domain.getFinishedAt();
    entity.score = domain.getScore();
    return entity;
  }

  public static toDomainArray(entities: SessionEntity[]): SessionDomain[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
