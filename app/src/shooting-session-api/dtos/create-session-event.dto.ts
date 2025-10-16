import { Type } from 'class-transformer';
import { IsString, IsDate, IsBoolean, IsNumber, ValidateNested } from 'class-validator';

export class CreateSessionEventShotPayloadDto {
  @IsBoolean()
  public hit!: boolean;

  @IsNumber()
  public distance!: number;
}

export class CreateSessionEventDto {
  @IsString()
  public type!: string;

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
