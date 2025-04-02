/* eslint-disable prettier/prettier */
import { Controller , Get, Body ,Post, HttpStatus,Res, BadRequestException} from "@nestjs/common";
import { Response } from 'express';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GenerateOtpDto } from "./modules/otp/generate-otp.dto";
import { VerifyOtpDto } from "./modules/otp/verify-otp.dto";
import { conflictMessage, generateSummary, Gone, serverError } from "./utils/constants";
import { NotFound } from "./utils/constants";
import { otpGenerated } from "./utils/constants";
import { otpVerified } from "./utils/constants";
import { verifySummary } from "./utils/constants";



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

  @Post()
  @ApiOperation({ summary: generateSummary })
  @ApiResponse({ status: HttpStatus.CREATED, description: otpGenerated })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: NotFound })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: conflictMessage })
  @ApiBody({ type: GenerateOtpDto }) 
  async generateOtp(@Body() body: GenerateOtpDto, @Res() res: Response) {
    try {
      const result = this.appService.generateOtp(body.userId);
      return res.status(result.statusCode).json({ result, message: result.message });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: `${serverError} ${error}` });
    }
  }
  
  @Post('_verify')
  @ApiOperation({ summary: verifySummary })
  @ApiResponse({ status: HttpStatus.OK, description: otpVerified })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: NotFound })
  @ApiResponse({ status: HttpStatus.GONE, description: Gone })
  @ApiBody({ type: VerifyOtpDto }) 
  verifyOtp(@Body() body: VerifyOtpDto, @Res() res: Response) {
    try{
      const result = this.appService.verifyOtp(body.userId,body.otp);
      const statusCode = result?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
      return res.status(statusCode).json({ result });
    }
    catch(error){
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: `${serverError} ${error}` });
    }
    
  }
}