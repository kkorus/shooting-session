import { Body, Controller, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { StartSessionDto, CreateSessionEventDto } from '../dtos';
import { Session } from '../../data-access-layer';
import { CreateSessionEventResponseDto } from '../dtos/create-session-event.dto';
import { JwtAuthGuard } from '../guards';
import { CurrentPlayerId } from '../decorators';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { StartSessionCommand, FinishSessionCommand, CreateSessionEventCommand } from '../commands';
import { GetSessionQuery, GetLeaderboardQuery } from '../queries';

@UseGuards(JwtAuthGuard)
@Controller('shooting-sessions')
export class ShootingSessionController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('ping')
  // curl -X GET http://localhost:3000/shooting-sessions/ping
  public ping(): void {
    console.log('pong');
  }

  @Get('leaderboard')
  public getLeaderboard(
    @CurrentPlayerId() playerId: string,
    @Query('mode') mode: string,
    @Query('limit') limit?: number,
  ): Promise<Session[]> {
    return this.queryBus.execute(new GetLeaderboardQuery(playerId, mode, limit));
  }

  @Get(':id')
  public getSession(@Param('id') id: string, @CurrentPlayerId() playerId: string): Promise<Session> {
    return this.queryBus.execute(new GetSessionQuery(id, playerId));
  }

  @Post()
  @HttpCode(201)
  public async startSession(@Body() dto: StartSessionDto, @CurrentPlayerId() playerId: string): Promise<{ sessionId: string }> {
    const { mode } = dto;
    const result = await this.commandBus.execute(new StartSessionCommand(playerId, mode));
    return result;
  }

  @Put(':id/finish')
  public finishSession(@Param('id') id: string, @CurrentPlayerId() playerId: string): Promise<void> {
    return this.commandBus.execute(new FinishSessionCommand(id, playerId));
  }

  @Post(':id/events')
  @HttpCode(201)
  public async createSessionEvent(
    @Param('id') id: string,
    @Body() CreateSessionEventDto: CreateSessionEventDto,
    @CurrentPlayerId() playerId: string,
  ): Promise<CreateSessionEventResponseDto> {
    const { type, timestamp, payload } = CreateSessionEventDto;
    await this.commandBus.execute(new CreateSessionEventCommand(id, playerId, type, timestamp, payload));

    return { accepted: true };
  }
}
