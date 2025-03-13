import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min, Length, Max } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Musculación' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 20 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(20)
  capacity: number;
}

export class UpdateRoomDto {
  @ApiProperty({ example: 'Crossfit' })
  @IsString()
  name?: string;

  @ApiProperty({ example: 15 })
  @IsInt()
  @Min(1)
  @Max(20)
  capacity?: number;
}
