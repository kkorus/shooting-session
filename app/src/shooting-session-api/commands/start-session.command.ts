import { Command } from '@nestjs/cqrs';

export class StartSessionCommand extends Command<{ sessionId: string }> {
  public constructor(
    public readonly playerId: string,
    public readonly mode: string,
  ) {
    super();
  }
}
