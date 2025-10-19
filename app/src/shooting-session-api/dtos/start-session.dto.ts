import { IsString, IsIn } from 'class-validator';
import { SESSION_MODES, SessionMode } from '../../const';

export class StartSessionDto {
  @IsString()
  @IsIn(SESSION_MODES)
  public mode!: SessionMode;
}
