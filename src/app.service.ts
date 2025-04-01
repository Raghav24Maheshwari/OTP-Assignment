/* eslint-disable prettier/prettier */
import { Injectable, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { OTP_EXPIRY_TIME } from './utils/constants';
import { generateOtp } from './utils/helper';
import { readOtpFile } from './utils/file-helper';
import { filePath } from './utils/constants';
@Injectable()
export class AppService {

  generateOtp(userId: string) {
    const otp = generateOtp();
    const timestamp = Date.now(); 
   let otpData = readOtpFile(filePath);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      otpData = fileContent
        ? (JSON.parse(fileContent) as {
            userId: string;
            otp: number;
            timestamp: number;
          }[])
        : [];
    }
    const existingUser = otpData.find((entry) => entry.userId === userId);
    if (existingUser) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'User ID already exists',
      };
    }
    const otpEntry = { userId, otp, timestamp };

    this.saveToFile(otpEntry);

    return {
      statusCode: HttpStatus.OK,
      message: 'OTP generated successfully',
      otp,
      timestamp,
    };
  }

  private saveToFile(otpEntry: {
    userId: string;
    otp: string;
    timestamp: number;
  }) {
    let otpData: { userId: string; otp: string; timestamp: number }[] = []; // Define correct type

    // if (fs.existsSync(this.filePath)) {
    //   const fileContent = fs.readFileSync(this.filePath, 'utf-8');
    //   otpData = fileContent
    //     ? (JSON.parse(fileContent) as {
    //         userId: string;
    //         otp: string;
    //         timestamp: number;
    //       }[])
    //     : [];
    // }

    otpData.push(otpEntry);

    fs.writeFileSync(filePath, JSON.stringify(otpData, null, 2));
  }

  
  verifyOtp(userId: string, otp: string) {
    if (!fs.existsSync(filePath)) {
      return { message: 'Invalid OTP' };
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const otpData: { userId: string; otp: string; timestamp: number }[] =
      JSON.parse(fileContent);

    const userEntry = otpData.find((entry) => entry.userId === userId);

    if (!userEntry) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'User ID not found' };
    }

    if (userEntry.otp !== otp) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'otp not found' };
    }

    const currentTime = Date.now();
    const timeDiff = currentTime - userEntry.timestamp;

    if (timeDiff > OTP_EXPIRY_TIME) {
      return { statusCode: HttpStatus.GONE, message: 'OTP Expired' }; //  OTP expired
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'OTP Verified',
      otp: userEntry.otp,
      timestamp: userEntry.timestamp,
    };
  }
}
