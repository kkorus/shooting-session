import { Command } from '@nestjs/cqrs';
import { SessionEventType } from '../../const';

export interface SessionEventPayload {
  hit: boolean;
  distance: number;
}

export class CreateSessionEventCommand extends Command<void> {
  public constructor(
    public readonly sessionId: string,
    public readonly type: SessionEventType,
    public readonly timestamp: Date,
    public readonly payload: SessionEventPayload,
  ) {
    super();
  }
}
