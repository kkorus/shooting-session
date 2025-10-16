import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ShootingSessionService } from '../services/shooting-session.service';
import * as uuid from 'uuid';
import { StartSessionDto } from '../dtos';

@Controller('shooting-sessions/')
export class ShootingSessionController {
  public constructor(private readonly shootingSessionService: ShootingSessionService) {}

  @Get('/ping')
  // curl -X GET http://localhost:3000/shooting-sessions/ping
  public ping(): void {
    console.log('pong');
  }

  @Get('/:id')
  public getSession(@Param('id') id: string): void {}

  @Get('leaderboard')
  public getLeaderboard(): void {}

  @Post()
  @HttpCode(201)
  // curl -X POST http://localhost:3000/shooting-sessions -H "Content-Type: application/json" -d '{"mode": "arcade"}'
  public async startSession(@Body() dto: StartSessionDto): Promise<void> {
    const { mode } = dto;
    await this.shootingSessionService.startSession({
      playerId: uuid.v4() as string,
      mode,
    });
  }

  @Post('/:id/events')
  public addSessionEvent(@Param('id') id: string, @Body() dto: any): void {}

  @Post('/:id/finish')
  public finishSession(@Param('id') id: string): void {}
}
