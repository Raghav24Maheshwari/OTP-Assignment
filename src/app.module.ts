import { Module } from '@nestjs/common';
import { helloController, OtpController } from './otp.controller';
import { AppService } from './app.service';


@Module({
  controllers: [OtpController, helloController],
  providers: [AppService],
})
export class AppModule {}
