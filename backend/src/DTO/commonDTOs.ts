export interface PaginationDTO {
  page: number;
  limit: number;
}
export interface VerifyOtpDTO {
  email: string;
  otp: string;
}
export interface ResendOtpDTO {
  email: string;
}
export interface ResetPasswordDTO {
  email: string;
  newPassword: string;
}
export interface GoogleProfileDTO {
  id: string;
  email: string;
  displayName: string;
}
