import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import OTPService from "../utils/OTPService";

import userRepository from "../repositories/user.repository";
import { IUser } from "../models/user.model";
import { IUserService } from "./interfaces/IUserService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { isValidEmail, isValidOTP, isValidPhone } from "../utils/validators";

interface SignupData extends Partial<IUser> {
    confirmPassword?: string;
  }
  
  class UserService implements IUserService {
    private sanitizeUser(user: IUser) {
        
      const { password, otp, __v, ...sanitizedUser } = user.toObject();
      return sanitizedUser;
    }

   async registerUser(
    userData: SignupData
  ): Promise<{ message: string; status: number }> {
    const { name, email, password, confirmPassword, phone } = userData;
    if (!name || !email || !password || !confirmPassword ||!phone) {
      throw new Error(MESSAGES.ERROR.INVALID_INPUT);
    }
    if (!isValidEmail(email)) {
      throw new Error("Invalid email format");
    }
    if (!isValidPhone(phone)) {
              throw new Error("Invalid Phone number");
     }
    if (password !== confirmPassword) {
      throw new Error(MESSAGES.ERROR.PASSWORD_MISMATCH);
    }
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error(MESSAGES.ERROR.EMAIL_EXISTS);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = OTPService.generateOTP();
    await OTPService.sendOTP(email, otp);

    console.log(otp,"and email",email);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await userRepository.create({
      ...userData,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpires,
      });
    return { message: MESSAGES.SUCCESS.SIGNUP, status: STATUS_CODES.CREATED };
  }

  async verifyOTP(
    email: string,
    otp: string
  ): Promise<{ message: string; status: number }> {
    console.log(email,"email")
    const user = await userRepository.findByEmail(email);
    console.log(user,"user")
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }
    if (!isValidOTP(otp)) {
      throw new Error("Invalid otp");
    }
    console.log('user otp',user.otp ,"and " ,otp)
    console.log("Stored OTP Expires:", user.otpExpires?.getTime());
console.log("Current Time:", Date.now());

    if (user.otp !== otp || (user.otpExpires?.getTime() ?? 0) < Date.now()) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }
    // user.isVerified = true;
    // user.otp = undefined;
    // user.otpExpires = undefined;

    await userRepository.update(user._id.toString(), {
      isVerified: true,
      otp: null,
      otpExpires: null,
    });
    
    return { message: MESSAGES.SUCCESS.OTP_VERIFIED, status: STATUS_CODES.OK };
  }

  async resendOTP(email: string): Promise<{ message: string; status: number }> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    // if (user.isVerified) {
    //   throw new Error(MESSAGES.ERROR.ALREADY_VERIFIED);
    // }

    const newOtp = OTPService.generateOTP();

    await OTPService.sendOTP(email, newOtp);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    console.log(newOtp);

    user.otp = newOtp;
    user.otpExpires=otpExpires
    await userRepository.update(user._id.toString(), user);

    return { message: MESSAGES.SUCCESS.OTP_RESENT, status: STATUS_CODES.OK };
  }
  
  async loginUser(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string; message: string; status: number }> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    if (!user.isVerified) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }
    if (user.status==="Blocked") {
      throw new Error(MESSAGES.ERROR.BLOCKED_USER);
    }
    if (!user.password) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }
    const token = jwt.sign({ userId: user._id, type: "user" }, jwtSecret, {
      expiresIn: "1h",
    });
     console.log(token,"jwt token")
    return {
      user: this.sanitizeUser(user),
      token,
      message: MESSAGES.SUCCESS.LOGIN,
      status: STATUS_CODES.OK,
    };
  }

  async resetPassword(
    email:string,
    newPassword:string
  ):Promise<{ message:string; status: number}> {
    const user = await userRepository.findByEmail(email);
    if(!user){
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear OTP fields
    user.password = hashedPassword;
    user.otp = null; // Ensure OTP cannot be reused
    user.otpExpires = null;
    user.isVerified = true; // Ensure user is marked as verified

    // Save updated user
    await userRepository.update(user._id.toString(), user);
    return { message: MESSAGES.SUCCESS.PASSWORD_RESET, status: STATUS_CODES.OK };

  }

  async processGoogleAuth(
    profile: any
  ): Promise<{ user: IUser; token: string; message: string; status: number }> {
    const email = profile.email;
    let user = await userRepository.findByEmail(email);
    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id;
        await userRepository.update(user._id.toString(), user);
      }
    } else {
      user = await userRepository.create({
        googleId: profile.id,
        name: profile.displayName,
        email,
        password: "",
        isVerified: true,
      });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }

    const token = jwt.sign(
      {
        userId: user._id,
        type: "user",
        name: user.name,
        email: user.email,
        phone: user.phone,
        // profileImage: user.profileImage,
      },
      jwtSecret,
      { expiresIn: "1h" }
    );

    return {
      user: this.sanitizeUser(user),
      token,
      message: MESSAGES.SUCCESS.LOGIN,
      status: STATUS_CODES.OK,
    };
  }
    }

    export default new UserService();