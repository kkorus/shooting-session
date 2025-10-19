import { Query } from '@nestjs/cqrs';
import { Session } from '../../data-access-layer';
import { SessionMode } from '@const';

export class GetLeaderboardQuery extends Query<Session[]> {
  public constructor(
    public readonly playerId: string,
    public readonly mode: SessionMode,
    public readonly limit?: number,
  ) {
    super();
  }
}
