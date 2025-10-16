import { Body, Controller, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { ShootingSessionService } from '../services/shooting-session.service';
import * as uuid from 'uuid';
import { StartSessionDto, CreateSessionEventDto } from '../dtos';
import { Session } from '../../data-access-layer';
import { CreateSessionEventResponseDto } from '../dtos/create-session-event.dto';

@Controller('shooting-sessions/')
export class ShootingSessionController {
  public constructor(private readonly shootingSessionService: ShootingSessionService) {}

  @Get('/ping')
  // curl -X GET http://localhost:3000/shooting-sessions/ping
  public ping(): void {
    console.log('pong');
  }

  @Get('/:id')
  public getSession(@Param('id') id: string): Promise<Session> {
    return this.shootingSessionService.getSessionById(id);
  }

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

  @Put('/:id/finish')
  public finishSession(@Param('id') id: string): Promise<void> {
    return this.shootingSessionService.closeSession(id);
  }

  @Post('/:id/events')
  public async addSessionEvent(
    @Param('id') id: string,
    @Body() CreateSessionEventDto: CreateSessionEventDto,
  ): Promise<CreateSessionEventResponseDto> {
    const { type, timestamp, payload } = CreateSessionEventDto;
    await this.shootingSessionService.addSessionEvent(id, type, timestamp, payload);

    return { accepted: true };
  }
}
