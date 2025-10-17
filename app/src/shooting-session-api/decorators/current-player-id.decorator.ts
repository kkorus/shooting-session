import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';

export const CurrentPlayerId = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  if (!req.user?.playerId) {
    throw new ForbiddenException('Missing playerId');
  }

  return req.user.playerId as string;
});
