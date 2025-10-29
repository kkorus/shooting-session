export class SessionNotOwnedByPlayerError extends Error {
  constructor(playerId: string) {
    super(`Player ${playerId} is not authorized to access this session`);
    this.name = 'SessionNotOwnedByPlayerError';
  }
}

export class SessionAlreadyClosedError extends Error {
  constructor() {
    super('Session already closed');
    this.name = 'SessionAlreadyClosedError';
  }
}

export class InvalidEventTimestampError extends Error {
  constructor() {
    super('Event timestamp is before session start time');
    this.name = 'InvalidEventTimestampError';
  }
}

export class SessionNotFoundError extends Error {
  constructor(sessionId: string) {
    super(`Session with id ${sessionId} not found`);
    this.name = 'SessionNotFoundError';
  }
}
