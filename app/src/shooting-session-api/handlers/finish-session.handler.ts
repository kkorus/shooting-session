import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FinishSessionCommand } from '../commands';
import { ShootingSessionService } from '../../shooting-session/services';
import { LoggerService } from '../services';

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
      throw error;
    }
  }
}
