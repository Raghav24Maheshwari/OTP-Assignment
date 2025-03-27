import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
    filePath = path.join(process.cwd(), 'src', 'otp.json');
    OTP_EXPIRY_TIME = 10 * 60 * 1000; // 


  generateOtp(userId: string) {
    console.log(userId,"1234567")
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit OTP
    const timestamp = Date.now(); // Get timestamp in milliseconds

    const otpEntry = { userId, otp, timestamp };

    this.saveToFile(otpEntry);

    return { message: 'OTP generated successfully', otp, timestamp };
  }

  private saveToFile(otpEntry: { userId: string; otp: string; timestamp: number }) {
    let otpData: { userId: string; otp: string; timestamp: number }[] = []; // Define correct type
  
    if (fs.existsSync(this.filePath)) {
      const fileContent = fs.readFileSync(this.filePath, 'utf-8');
      otpData = fileContent ? JSON.parse(fileContent) as { userId: string; otp: string; timestamp: number }[] : [];
    }
  
    otpData.push(otpEntry);
  
    fs.writeFileSync(this.filePath, JSON.stringify(otpData, null, 2));
  }

  verifyOtp(userId: string) {
    if (!fs.existsSync(this.filePath)) {
      return { message: 'Invalid OTP' };
    }

    const fileContent = fs.readFileSync(this.filePath, 'utf-8');
    const otpData: { userId: string; otp: string; timestamp: number }[] = JSON.parse(fileContent);

    const userOtp = otpData.find(entry => entry.userId === userId);

    if (!userOtp) {
      return { message: 'Invalid OTP' }; // ❌ User ID not found
    }

    const currentTime = Date.now();
    const timeDiff = currentTime - userOtp.timestamp;

    if (timeDiff > this.OTP_EXPIRY_TIME) {
      return { message: 'OTP Expired' }; // ❌ OTP expired
    }

    return { message: 'OTP Verified', otp: userOtp.otp, timestamp: userOtp.timestamp }; // ✅ OTP valid
  }

  
}
