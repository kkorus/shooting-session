import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSessionEventCommand } from '../commands';
import { ShootingSessionService } from '../../shooting-session/services';
import { LoggerService } from '../services';

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
      throw error;
    }
  }
}
