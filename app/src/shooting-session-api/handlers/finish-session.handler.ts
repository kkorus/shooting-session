import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { FinishSessionCommand } from '../commands';
import { ShootingSessionService } from '../../shooting-session/services';
import { LoggerService } from '../services';
import { SessionNotFoundError, SessionNotOwnedByPlayerError, SessionAlreadyClosedError } from '../../domain/exceptions';

@CommandHandler(FinishSessionCommand)
export class FinishSessionHandler implements ICommandHandler<FinishSessionCommand> {
  public constructor(
    private readonly shootingSessionService: ShootingSessionService,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(command: FinishSessionCommand): Promise<void> {
    const { sessionId, playerId } = command;
    try {
      await this.shootingSessionService.closeSession(sessionId, playerId);
      this.loggerService.info(`Session ${sessionId} finished for player ${playerId}`);
    } catch (error) {
      this.loggerService.error(`Failed to finish session ${sessionId}`, error);

      if (error instanceof SessionNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof SessionNotOwnedByPlayerError) {
        throw new ForbiddenException(error.message);
      }
      if (error instanceof SessionAlreadyClosedError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
