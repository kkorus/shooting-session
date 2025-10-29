import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Session as DomainSession } from '../../domain/entities';
import { GetSessionQuery } from '../queries';
import { ShootingSessionService } from '../../shooting-session/services';
import { LoggerService } from '../services';
import { SessionNotFoundError, SessionNotOwnedByPlayerError } from '../../domain/exceptions';

@QueryHandler(GetSessionQuery)
export class GetSessionHandler implements IQueryHandler<GetSessionQuery> {
  public constructor(
    private readonly shootingSessionService: ShootingSessionService,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(query: GetSessionQuery): Promise<DomainSession> {
    const { sessionId, playerId } = query;
    try {
      const session = await this.shootingSessionService.getSessionById(sessionId, playerId);
      this.loggerService.info(`Session ${sessionId} retrieved for player ${playerId}`);
      return session;
    } catch (error) {
      this.loggerService.error(`Failed to retrieve session ${sessionId}`, error);

      if (error instanceof SessionNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof SessionNotOwnedByPlayerError) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }
}
