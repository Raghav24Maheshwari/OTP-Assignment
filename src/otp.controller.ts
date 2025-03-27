
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
  generateOtp(@Body('userId') userId: string) {
    return this.appService.generateOtp(userId);
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