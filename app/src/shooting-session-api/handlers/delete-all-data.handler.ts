import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAllDataCommand } from '../commands';
import { LoggerService } from '../services';
import { Inject } from '@nestjs/common';
import {
  IUserRepository,
  ISessionRepository,
  ISessionEventRepository,
} from '../../domain/repositories';

@CommandHandler(DeleteAllDataCommand)
export class DeleteAllDataHandler implements ICommandHandler<DeleteAllDataCommand> {
  public constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(ISessionRepository)
    private readonly sessionRepository: ISessionRepository,
    @Inject(ISessionEventRepository)
    private readonly sessionEventRepository: ISessionEventRepository,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(): Promise<void> {
    try {
      this.loggerService.info('Deleting all data from session events, sessions, and users');

      await this.sessionEventRepository.deleteAll();
      await this.sessionRepository.deleteAll();
      await this.userRepository.deleteAll();

      this.loggerService.info('All data deleted successfully');
    } catch (error) {
      this.loggerService.error('Failed to delete all data', error);
      throw error;
    }
  }
}
