import { Body, Controller, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ShootingSessionService } from '../services/shooting-session.service';
import { StartSessionDto, CreateSessionEventDto } from '../dtos';
import { Session } from '../../data-access-layer';
import { CreateSessionEventResponseDto } from '../dtos/create-session-event.dto';
import { JwtAuthGuard } from '../guards';
import { CurrentPlayerId } from '../decorators';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { StartSessionCommand } from '../commands';
import { GetSessionQuery } from '../queries';

@UseGuards(JwtAuthGuard)
@Controller('shooting-sessions/')
export class ShootingSessionController {
  public constructor(
    private readonly shootingSessionService: ShootingSessionService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('ping')
  // curl -X GET http://localhost:3000/shooting-sessions/ping
  public ping(): void {
    console.log('pong');
  }

  // curl -X GET http://localhost:3000/shooting-sessions/123
  @Get(':id')
  public getSession(@Param('id') id: string, @CurrentPlayerId() playerId: string): Promise<Session> {
    return this.queryBus.execute(new GetSessionQuery(id, playerId));
  }

  // curl -X GET http://localhost:3000/shooting-sessions/leaderboard?mode=arcade&limit=10
  @Get('leaderboard')
  public getLeaderboard(@Query('mode') mode: string, @Query('limit') limit?: number): Promise<Session[]> {
    return this.shootingSessionService.getLeaderboard({ mode, limit });
  }

  // curl -X POST http://localhost:3000/shooting-sessions -H "Content-Type: application/json" -d '{"mode": "arcade"}'
  @Post()
  @HttpCode(201)
  public async startSession(@Body() dto: StartSessionDto, @CurrentPlayerId() playerId: string): Promise<void> {
    const { mode } = dto;
    await this.commandBus.execute(new StartSessionCommand(playerId, mode));
    // await this.shootingSessionService.startSession({
    //   playerId,
    //   mode,
    // });
  }

  // curl -X PUT http://localhost:3000/shooting-sessions/123/finish
  @Put(':id/finish')
  public finishSession(@Param('id') id: string): Promise<void> {
    return this.shootingSessionService.closeSession(id);
  }

  // curl -X POST http://localhost:3000/shooting-sessions/123/events -H "Content-Type: application/json" -d '{"type": "shot", "timestamp": "2021-01-01T00:00:00Z", "payload": {"hit": true, "distance": 10}}'
  @Post(':id/events')
  @HttpCode(201)
  public async addSessionEvent(
    @Param('id') id: string,
    @Body() CreateSessionEventDto: CreateSessionEventDto,
  ): Promise<CreateSessionEventResponseDto> {
    const { type, timestamp, payload } = CreateSessionEventDto;
    await this.shootingSessionService.addSessionEvent(id, type, timestamp, payload);

    return { accepted: true };
  }
}
