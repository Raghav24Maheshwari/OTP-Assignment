/* eslint-disable prettier/prettier */
import { Controller , Get, Body ,Post, HttpStatus,Res} from "@nestjs/common";
import { Response } from 'express';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GenerateOtpDto } from "./modules/otp/generate-otp.dto";
import { VerifyOtpDto } from "./modules/otp/verify-otp.dto";



@ApiTags('Get Hello') 
@Controller()
export class helloController {
  constructor(private readonly appService: AppService) {}
  @Get('/')
  @ApiOperation({ summary: 'Returns a simple Hello World message' })
  @ApiResponse({ status: 200, description: 'Returns Hello, World!' })
  getHello(@Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).send('Hello, World!');
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(`An error occurred${error}`);
    }
  }
}

@ApiTags('OTP')
@Controller('otp')
export class OtpController {
  constructor(private readonly appService: AppService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generates an OTP for a given user id' })
  @ApiResponse({ status: 201, description: 'OTP generated successfully' })
  @ApiResponse({ status: 400, description: 'User ID is required' })
  @ApiResponse({ status: 409, description: 'User ID already exists' })
  @ApiBody({ type: GenerateOtpDto }) 
  generateOtp(@Body() body: GenerateOtpDto, @Res() res: Response) {
    if (!body || !body.userId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'User ID is required' });
    }
    
    const result = this.appService.generateOtp(body.userId);
    return res.status(result.statusCode).json(result);
  }
  
  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify an OTP for a given userId or OTP' })
  @ApiResponse({ status: 201, description: 'OTP Verified' })
  @ApiResponse({ status: 400, description: 'User ID is required and OTP is required' })
  @ApiResponse({ status: 410, description: 'otp expired' })
  @ApiBody({ type: VerifyOtpDto }) 
  verifyOtp(@Body() body: VerifyOtpDto, @Res() res: Response) {
  if (!body.userId) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'User ID is required' });
  }
  if (!body.otp) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'OTP is required' });
  }

  const result = this.appService.verifyOtp(body.userId,body.otp);
  return res.status(result.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
  }