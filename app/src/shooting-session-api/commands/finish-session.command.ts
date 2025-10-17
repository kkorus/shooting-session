import { Command } from '@nestjs/cqrs';

export class FinishSessionCommand extends Command<void> {
  public constructor(
    public readonly sessionId: string,
    public readonly playerId: string,
  ) {
    super();
  }
}
