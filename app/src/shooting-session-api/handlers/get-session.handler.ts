import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Session } from '../../data-access-layer';
import { GetSessionQuery } from '../queries';
import { ShootingSessionService } from '../services';

@QueryHandler(GetSessionQuery)
export class GetSessionHandler implements IQueryHandler<GetSessionQuery> {
  public constructor(private readonly shootingSessionService: ShootingSessionService) {}

  public async execute(query: GetSessionQuery): Promise<Session> {
    const { sessionId, playerId } = query;
    return this.shootingSessionService.getSessionById(sessionId, playerId);
  }
}
