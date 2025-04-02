import * as path from 'path';

export const OTP_EXPIRY_TIME = 600000;
export const  filePath = path.join(process.cwd(), 'src', 'otp.json');
export const NotFound = "required fields are not found"
export const Gone = "OTP Expired"
export const generateSummary = "Generates an OTP for a given user id";
export const verifySummary = "Verify an OTP for a given userId or OTP";
export const otpGenerated = "OTP generated successfully.";
export const otpVerified = "OTP verified successfully.";
export const conflictMessage = "User ID already exists.";
export const serverError = "Something went wrong.";