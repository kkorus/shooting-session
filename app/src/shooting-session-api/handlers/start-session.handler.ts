import { CommandHandler } from '@nestjs/cqrs';
import { StartSessionCommand } from '../commands';
import { ShootingSessionService } from '../services';

@CommandHandler(StartSessionCommand)
export class StartSessionHandler {
  public constructor(private readonly shootingSessionService: ShootingSessionService) {}

  public async execute(command: StartSessionCommand): Promise<{ sessionId: string }> {
    const { playerId, mode } = command;
    const sessionId = await this.shootingSessionService.startSession({ playerId, mode });
    return { sessionId };
  }
}
