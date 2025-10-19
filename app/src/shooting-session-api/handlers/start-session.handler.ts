import { CommandHandler } from '@nestjs/cqrs';
import { StartSessionCommand } from '../commands';
import { ShootingSessionService } from '../../shooting-session/services';
import { LoggerService } from '../services';

@CommandHandler(StartSessionCommand)
export class StartSessionHandler {
  public constructor(
    private readonly shootingSessionService: ShootingSessionService,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(command: StartSessionCommand): Promise<{ sessionId: string }> {
    const { playerId, mode } = command;
    try {
      const sessionId = await this.shootingSessionService.startSession({ playerId, mode });
      this.loggerService.info(`Session started for player ${playerId} in mode ${mode}`);
      return { sessionId };
    } catch (error) {
      this.loggerService.error('Failed to start session', error);
      throw error;
    }
  }
}
