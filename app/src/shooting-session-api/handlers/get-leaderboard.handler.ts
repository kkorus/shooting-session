import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Session } from '../../data-access-layer';
import { GetLeaderboardQuery } from '../queries';
import { ShootingSessionService } from '../../shooting-session/services';
import { LoggerService } from '../services';

@QueryHandler(GetLeaderboardQuery)
export class GetLeaderboardHandler implements IQueryHandler<GetLeaderboardQuery> {
  public constructor(
    private readonly shootingSessionService: ShootingSessionService,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(query: GetLeaderboardQuery): Promise<Session[]> {
    const { playerId, mode, limit } = query;
    try {
      const sessions = await this.shootingSessionService.getLeaderboard({ playerId, mode, limit });
      this.loggerService.info(`Leaderboard retrieved for player ${playerId} in mode ${mode} (${sessions.length} sessions)`);
      return sessions;
    } catch (error) {
      this.loggerService.error(`Failed to retrieve leaderboard for player ${playerId}`, error);
      throw error;
    }
  }
}
