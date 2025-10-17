import { Type } from 'class-transformer';
import { IsDate, IsBoolean, IsNumber, ValidateNested, IsEnum } from 'class-validator';
import { SessionEventType } from '@const';

export class CreateSessionEventShotPayloadDto {
  @IsBoolean()
  public hit!: boolean;

  @IsNumber()
  public distance!: number;
}

export class CreateSessionEventDto {
  @IsEnum(SessionEventType)
  public type!: SessionEventType;

  @IsDate()
  public timestamp!: Date;

  @ValidateNested()
  @Type(() => CreateSessionEventShotPayloadDto)
  public payload!: CreateSessionEventShotPayloadDto;
}

export class CreateSessionEventResponseDto {
  @IsBoolean()
  public accepted!: boolean;
}
