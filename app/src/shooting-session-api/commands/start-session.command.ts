import { Command } from '@nestjs/cqrs';
import { SessionMode } from '@const';

export class StartSessionCommand extends Command<{ sessionId: string }> {
  public constructor(
    public readonly playerId: string,
    public readonly mode: SessionMode,
  ) {
    super();
  }
}
