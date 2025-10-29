import { SessionMode } from '@const';
import { SessionNotOwnedByPlayerError, SessionAlreadyClosedError, InvalidEventTimestampError } from '../exceptions';

export class Session {
  public constructor(
    private readonly id: string,
    private readonly playerId: string,
    private readonly mode: SessionMode,
    private readonly startedAt: Date,
    private finishedAt: Date | null,
    private score: number | null,
  ) {}

  // ===== Getters =====

  public getId(): string {
    return this.id;
  }

  public getPlayerId(): string {
    return this.playerId;
  }

  public getMode(): SessionMode {
    return this.mode;
  }

  public getStartedAt(): Date {
    return this.startedAt;
  }

  public getFinishedAt(): Date | null {
    return this.finishedAt;
  }

  public getScore(): number | null {
    return this.score;
  }

  // ===== Business Logic Methods =====

  public isOwnedBy(playerId: string): boolean {
    return this.playerId === playerId;
  }

  public ensureIsOwnedBy(playerId: string): void {
    if (!this.isOwnedBy(playerId)) {
      throw new SessionNotOwnedByPlayerError(playerId);
    }
  }

  public isClosed(): boolean {
    return this.finishedAt !== null;
  }

  public isOpen(): boolean {
    return !this.isClosed();
  }

  public ensureIsOpen(): void {
    if (this.isClosed()) {
      throw new SessionAlreadyClosedError();
    }
  }

  public close(score: number): void {
    this.ensureIsOpen();
    this.finishedAt = new Date();
    this.score = score;
  }

  public validateEventTimestamp(timestamp: Date): void {
    if (timestamp < this.startedAt) {
      throw new InvalidEventTimestampError();
    }
  }

  public static create(playerId: string, mode: SessionMode): Session {
    return new Session(
      crypto.randomUUID(), // Temporary ID, will be replaced by DB
      playerId,
      mode,
      new Date(),
      null,
      null,
    );
  }

  public static reconstitute(
    id: string,
    playerId: string,
    mode: SessionMode,
    startedAt: Date,
    finishedAt: Date | null,
    score: number | null,
  ): Session {
    return new Session(id, playerId, mode, startedAt, finishedAt, score);
  }
}
