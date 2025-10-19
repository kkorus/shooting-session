import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  public info(message: string): void {
    console.log(message);
  }

  public error(message: string, error: Error | unknown | undefined): void {
    console.error(message, error instanceof Error ? error.message : error);
  }

  public warn(message: string): void {
    console.warn(message);
  }
}
