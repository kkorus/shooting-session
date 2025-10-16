import { IsString, IsIn } from 'class-validator';

export class StartSessionDto {
  @IsString()
  @IsIn(['arcade'])
  public mode!: 'arcade';
}
