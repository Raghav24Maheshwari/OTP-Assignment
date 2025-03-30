import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ example: 'user123', description: 'The ID of the user' })
  userId: string;

  @ApiProperty({ example: '123456', description: 'The OTP code' })
  otp: string;
}
