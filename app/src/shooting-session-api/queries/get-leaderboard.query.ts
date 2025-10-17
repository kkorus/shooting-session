import { Query } from '@nestjs/cqrs';
import { Session } from '../../data-access-layer';

export class GetLeaderboardQuery extends Query<Session[]> {
  public constructor(
    public readonly playerId: string,
    public readonly mode: string,
    public readonly limit?: number,
  ) {
    super();
  }
}
