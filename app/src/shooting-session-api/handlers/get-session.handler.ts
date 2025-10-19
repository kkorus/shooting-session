import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Session } from '../../data-access-layer';
import { GetSessionQuery } from '../queries';
import { ShootingSessionService } from '../../shooting-session/services';
import { LoggerService } from '../services';

@QueryHandler(GetSessionQuery)
export class GetSessionHandler implements IQueryHandler<GetSessionQuery> {
  public constructor(
    private readonly shootingSessionService: ShootingSessionService,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(query: GetSessionQuery): Promise<Session> {
    const { sessionId, playerId } = query;
    try {
      const session = await this.shootingSessionService.getSessionById(sessionId, playerId);
      this.loggerService.info(`Session ${sessionId} retrieved for player ${playerId}`);
      return session;
    } catch (error) {
      this.loggerService.error(`Failed to retrieve session ${sessionId}`, error);
      throw error;
    }
  }
}
