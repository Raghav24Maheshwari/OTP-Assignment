/* eslint-disable prettier/prettier */
import { Injectable, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import { OTP_EXPIRY_TIME } from './utils/constants';
import { generateOtp } from './utils/helper';
import { readOtpFile } from './utils/file-helper';
import { filePath } from './utils/constants';
import { saveOtpToFile } from './utils/file-helper';
@Injectable()
export class AppService {

  generateOtp(userId: string) {
    const otp = generateOtp();
    const timestamp = Date.now(); 
   const otpData = readOtpFile(filePath);
    const existingUser = otpData.find((entry) => entry.userId === userId);
    if (existingUser) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'User ID already exists',
      };
    }
    const otpEntry = { userId, otp, timestamp };

    saveOtpToFile(filePath,otpEntry);

    return {
      statusCode: HttpStatus.OK,
      message: 'OTP generated successfully',
      otp,
      timestamp,
    };
  }

  verifyOtp(userId: string, otp: string) {
    if (!fs.existsSync(filePath)) {
      return { message: 'Invalid OTP' };
    }

     const otpData = readOtpFile(filePath);

    const userEntry = otpData.find((entry) => entry.userId === userId);

    if (!userEntry) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'User ID not found' };
    }

    if (userEntry.otp !== otp) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'otp not found' };
    }

    const currentTime = Date.now();
    const timeDiff = currentTime - userEntry.timestamp;
    const expiryTime = Number(process.env.OTP_EXPIRY_TIME)
    if (timeDiff > expiryTime) {
      return { statusCode: HttpStatus.GONE, message: 'OTP Expired' }; 
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'OTP Verified',
      otp: userEntry.otp,
      timestamp: userEntry.timestamp,
    };
  }
}
