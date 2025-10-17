import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Session } from '../../data-access-layer';
import { GetLeaderboardQuery } from '../queries';
import { ShootingSessionService } from '../../shooting-session/services';

@QueryHandler(GetLeaderboardQuery)
export class GetLeaderboardHandler implements IQueryHandler<GetLeaderboardQuery> {
  public constructor(private readonly shootingSessionService: ShootingSessionService) {}

  public async execute(query: GetLeaderboardQuery): Promise<Session[]> {
    const { playerId, mode, limit } = query;
    return this.shootingSessionService.getLeaderboard({ playerId, mode, limit });
  }
}
