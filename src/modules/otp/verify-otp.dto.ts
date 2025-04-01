import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: 'user123', description: 'The ID of the user' })
  @IsString()
  @IsNotEmpty()
  userId: string;
  
  @ApiProperty({ example: '123456', description: 'The OTP code' })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
