
import { Controller , Get, Body ,Post, HttpStatus,Res} from "@nestjs/common";
import { Response } from 'express';
import { AppService } from './app.service';
import { CLIENT_RENEG_LIMIT } from "tls";

@Controller('otp')
export class OtpController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).send('Hello, World!');
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(`An error occurred${error}`);
    }
  }

  @Post('generate')
  generateOtp(@Body('userId') userId: string, @Res() res: Response) {
    if (!userId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'User ID is required' });
    }

    const result = this.appService.generateOtp(userId);
    return res.status(HttpStatus.CREATED).json(result);
  }

  @Post('verify-otp')
  verifyOtp(@Res() res: Response , @Body('userId') userId: string,@Body('otp') otp: string) {
    if(userId===undefined || userId===null) {
      return res
      .status(HttpStatus.BAD_REQUEST)
      .send(`required filed userId is missing`);
  }
  if (!userId) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'User ID is required' });
  }
  if (!otp) {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: 'OTP is required' });
  }

  const result = this.appService.verifyOtp(userId,otp);
  return res.status(HttpStatus.OK).json(result);
    }
  }





// import { Controller , Get, Post, HttpStatus,Res} from "@nestjs/common";
// import { Response } from 'express';
// import { AppService } from "./app.service";

// @Controller("/users")
// export class UsersController {
//     constructor(private readonly appService: AppService) {}
//     @Get()
//     getHello(): string {
//         return this.appService.getHello();
//       }
//   @Post("/post")
//   postUsers(@Res() res:Response){
//     try{
//         const user = { id: 1, name: 'Raghav' };
//         return res.status(201).json({message:'User Created',user:user})
//     }
//     catch(e){
//         return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: `error: ${e}`})
//     }
//   }

// }




// // @Controller()
// // export class AppController {
// //   constructor(private readonly appService: AppService) {}

// //   @Get()
//   getHello(@Res() res: Response) {
//     try {
//       return res.status(HttpStatus.OK).send('Hello, World!');
//     } catch (error) {
//       return res
//         .status(HttpStatus.INTERNAL_SERVER_ERROR)
//         .send(An error occurred${error});
//     }
//   }
// // }