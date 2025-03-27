import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { AppService } from './app.service';


@Module({
  controllers: [OtpController],
  providers: [AppService],
})
export class AppModule {}
