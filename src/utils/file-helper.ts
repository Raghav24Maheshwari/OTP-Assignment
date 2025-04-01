import * as fs from 'fs';

export const readOtpFile = (filePath: string): { userId: string; otp: number; timestamp: number }[] => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return fileContent ? JSON.parse(fileContent) : [];
};
