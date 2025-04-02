import * as fs from 'fs';

export const readOtpFile = (filePath: string): { userId: string; otp: string; timestamp: number }[] => {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return fileContent ? JSON.parse(fileContent) : [];
  } catch (error) {
    console.error('Error reading OTP file:', error);
    return [];
  }
};

export function saveOtpToFile(filePath: string, otpEntry: { userId: string; otp: string; timestamp: number }) {
  try {
    let otpData = readOtpFile(filePath);
    otpData.push(otpEntry);
    fs.writeFileSync(filePath, JSON.stringify(otpData, null, 2));
  } catch (error) {
    console.error('Error writing OTP file:', error);
  }
}