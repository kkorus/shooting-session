import { Command } from '@nestjs/cqrs';

export class DeleteAllDataCommand extends Command<void> {
  public constructor() {
    super();
  }
}
