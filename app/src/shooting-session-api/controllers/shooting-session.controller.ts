import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ShootingSessionService } from '../services';

@Controller('shooting-sessions/')
export class ShootingSessionController {
  public constructor(
    private readonly _shootingSessionService: ShootingSessionService
  ) {}

  @Get(':id')
  public getSession(@Param('id') id: string): void {}

  @Get('leaderboard')
  public getLeaderboard(): void {}

  @Post()
  public startSession(): void {}

  @Post(':id/events')
  public addSessionEvent(@Param('id') id: string, @Body() dto: any): void {}

  @Post(':id/finish')
  public finishSession(@Param('id') id: string): void {}
}
