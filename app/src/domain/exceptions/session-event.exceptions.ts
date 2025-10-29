export class InvalidSessionEventPayloadError extends Error {
  constructor(message: string) {
    super(`Invalid session event payload: ${message}`);
    this.name = 'InvalidSessionEventPayloadError';
  }
}

export class SessionEventNotFoundError extends Error {
  constructor(eventId: string) {
    super(`Session event with id ${eventId} not found`);
    this.name = 'SessionEventNotFoundError';
  }
}
