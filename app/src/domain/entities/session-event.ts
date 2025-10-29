import { SessionEventType } from '@const';

export interface SessionEventPayload {
  hit: boolean;
  distance: number | null;
}

export class SessionEvent {
  constructor(
    private readonly id: string,
    private readonly sessionId: string,
    private readonly type: SessionEventType,
    private readonly timestamp: Date,
    private readonly payload: SessionEventPayload,
    private readonly createdAt: Date,
  ) {}

  // ===== Getters =====

  public getId(): string {
    return this.id;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getType(): SessionEventType {
    return this.type;
  }

  public getTimestamp(): Date {
    return this.timestamp;
  }

  public getPayload(): SessionEventPayload {
    return this.payload;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getHit(): boolean {
    return this.payload.hit;
  }

  public getDistance(): number | null {
    return this.payload.distance;
  }

  // ===== Business Logic Methods =====

  public isShot(): boolean {
    return this.type === SessionEventType.SHOT;
  }

  public isHit(): boolean {
    return this.payload.hit;
  }

  // ===== Factory Methods =====

  public static create(
    sessionId: string,
    type: SessionEventType,
    timestamp: Date,
    payload: SessionEventPayload,
  ): SessionEvent {
    return new SessionEvent(
      crypto.randomUUID(), // Temporary ID
      sessionId,
      type,
      timestamp,
      payload,
      new Date(),
    );
  }

  public static reconstitute(
    id: string,
    sessionId: string,
    type: SessionEventType,
    timestamp: Date,
    payload: SessionEventPayload,
    createdAt: Date,
  ): SessionEvent {
    return new SessionEvent(id, sessionId, type, timestamp, payload, createdAt);
  }
}
