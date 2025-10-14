import { Controller, Get } from '@nestjs/common';

@Controller('shooting-session')
export class ShootingSessionController {
  // curl localhost:3000/shooting-session/ping
  @Get('/ping')
  public ping(): { status: string } {
    return { status: 'pong' };
  }
}
