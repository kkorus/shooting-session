import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAllDataCommand } from '../commands';
import { UserRepository, SessionRepository, SessionEventRepository } from '../../data-access-layer';
import { LoggerService } from '../services';

@CommandHandler(DeleteAllDataCommand)
export class DeleteAllDataHandler implements ICommandHandler<DeleteAllDataCommand> {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly sessionEventRepository: SessionEventRepository,
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
