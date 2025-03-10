import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min, Length } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Musculación' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 20 })
  @IsNotEmpty()
  @IsInt()
  @Length(1, 20)
  capacity: number;
}

export class UpdateRoomDto {
  @ApiProperty({ example: 'Crossfit' })
  @IsString()
  name?: string;

  @ApiProperty({ example: 25 })
  @IsInt()
  @Length(1, 20)
  capacity?: number;
}
