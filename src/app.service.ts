/* eslint-disable prettier/prettier */
import { Injectable, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  filePath = path.join(process.cwd(), 'src', 'otp.json');
  OTP_EXPIRY_TIME = 10 * 60 * 1000; //

  generateOtp(userId: string) {
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit OTP
    const timestamp = Date.now(); // Get timestamp in milliseconds

    let otpData: { userId: string; otp: number; timestamp: number }[] = [];
    if (fs.existsSync(this.filePath)) {
      const fileContent = fs.readFileSync(this.filePath, 'utf-8');
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

    if (fs.existsSync(this.filePath)) {
      const fileContent = fs.readFileSync(this.filePath, 'utf-8');
      otpData = fileContent
        ? (JSON.parse(fileContent) as {
            userId: string;
            otp: string;
            timestamp: number;
          }[])
        : [];
    }

    otpData.push(otpEntry);

    fs.writeFileSync(this.filePath, JSON.stringify(otpData, null, 2));
  }

  verifyOtp(userId: string, otp: string) {
    if (!fs.existsSync(this.filePath)) {
      return { message: 'Invalid OTP' };
    }

    const fileContent = fs.readFileSync(this.filePath, 'utf-8');
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

    if (timeDiff > this.OTP_EXPIRY_TIME) {
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
