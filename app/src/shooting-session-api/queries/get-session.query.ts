import { Query } from '@nestjs/cqrs';
import { Session } from '../../domain/entities';

export class GetSessionQuery extends Query<Session> {
  public constructor(
    public readonly sessionId: string,
    public readonly playerId: string,
  ) {
    super();
  }
}
