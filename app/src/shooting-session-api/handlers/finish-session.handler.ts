import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FinishSessionCommand } from '../commands';
import { ShootingSessionService } from '../../shooting-session/services';

@CommandHandler(FinishSessionCommand)
export class FinishSessionHandler implements ICommandHandler<FinishSessionCommand> {
  public constructor(private readonly shootingSessionService: ShootingSessionService) {}

  public async execute(command: FinishSessionCommand): Promise<void> {
    const { sessionId } = command;
    return this.shootingSessionService.closeSession(sessionId);
  }
}
