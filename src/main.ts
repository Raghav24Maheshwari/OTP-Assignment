/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes unknown properties
      forbidNonWhitelisted: true, // Throws error for extra properties
      transform: true, // Auto-transform payloads to DTO instances
      stopAtFirstError: true, // Stops validation at the first error
    })
  );
  const config = new DocumentBuilder()
    .setTitle('OTP')
    .setDescription('This project is about to generate otp and verify otp')
    .setVersion('1.0')
    // .addTag('otp')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.use(bodyParser.json());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
