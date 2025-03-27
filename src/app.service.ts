import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  // private readonly filePath = path.join(__dirname, 'otp.json');
  private readonly filePath = path.join(process.cwd(), 'src', 'otp.json');


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
  
}
