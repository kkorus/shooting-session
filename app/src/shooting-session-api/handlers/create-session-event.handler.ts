import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSessionEventCommand } from '../commands';
import { ShootingSessionService } from '../../shooting-session/services';

@CommandHandler(CreateSessionEventCommand)
export class CreateSessionEventHandler implements ICommandHandler<CreateSessionEventCommand> {
  public constructor(private readonly shootingSessionService: ShootingSessionService) {}

  public async execute(command: CreateSessionEventCommand): Promise<void> {
    const { sessionId, type, timestamp, payload } = command;
    return this.shootingSessionService.createSessionEvent(sessionId, type, timestamp, payload);
  }
}
