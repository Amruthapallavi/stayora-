export const ROLES = {
    USER: "user",
    OWNER: "owner",
    ADMIN: "admin",
  };
  
  export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  };
  
  export const MESSAGES = {
    SUCCESS: {
      SIGNUP: "Signup successful. Please verify your email.",
      LOGIN: "Login successful",
      LOGOUT: "Logout successful",
      OTP_SENT: "OTP sent to your email",
      OTP_VERIFIED: "OTP verified successfully",
      OTP_RESENT: "OTP resent successfully",
      
      PASSWORD_RESET: "Password reset successful",
    },
    ERROR: {
      INVALID_CREDENTIALS: "Invalid credentials",
      EMAIL_EXISTS: "Email already exists",
      USER_NOT_FOUND: "User not found",
      OWNER_NOT_FOUND: "User not found",
      SERVICE_ALREADY_EXISTS:"This service already exists",
      INVALID_INPUT: "Invalid input: Email and Password are required",
      PASSWORD_MISMATCH: "Password and Confirm Password do not match",
      JWT_SECRET_MISSING: "JWT secret is not configured",
      OTP_INVALID: "Invalid OTP",
      BLOCKED_USER:"Currently You are Blocked",
      OTP_EXPIRED: "OTP has expired",
      UNAUTHORIZED: "Unauthorized access",
      FORBIDDEN: "Forbidden access",
      SERVER_ERROR: "Internal server error",
      MISSING_FIELDS: "Required fields are missing",
      INVALID_TOKEN: "Invalid or expired token",
      ALREADY_VERIFIED: "User is already verified",
      NOT_VERIFIED:"You are not verified",
    },
  };