
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateOtpDto {
  @ApiProperty({ example: 'user123', description: 'The ID of the user' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
