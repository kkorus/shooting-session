import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreateSessionEventCommand } from '../commands';
import { ShootingSessionService } from '../../shooting-session/services';
import { LoggerService } from '../services';
import {
  SessionNotFoundError,
  SessionNotOwnedByPlayerError,
  SessionAlreadyClosedError,
  InvalidEventTimestampError,
} from '../../domain/exceptions';

@CommandHandler(CreateSessionEventCommand)
export class CreateSessionEventHandler implements ICommandHandler<CreateSessionEventCommand> {
  public constructor(
    private readonly shootingSessionService: ShootingSessionService,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(command: CreateSessionEventCommand): Promise<void> {
    const { sessionId, playerId, type, timestamp, payload } = command;
    try {
      await this.shootingSessionService.createSessionEvent(sessionId, playerId, type, timestamp, payload);
      this.loggerService.info(`Event ${type} created for session ${sessionId} by player ${playerId}`);
    } catch (error) {
      this.loggerService.error(`Failed to create event for session ${sessionId}`, error);

      if (error instanceof SessionNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof SessionNotOwnedByPlayerError) {
        throw new ForbiddenException(error.message);
      }
      if (error instanceof SessionAlreadyClosedError) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof InvalidEventTimestampError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
