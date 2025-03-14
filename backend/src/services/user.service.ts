import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import OTPService from "../utils/OTPService";

import userRepository from "../repositories/user.repository";
import { IUser } from "../models/user.model";
import { IUserService } from "./interfaces/IUserService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";

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
    if (user.otp !== otp || (user.otpExpires?.getTime() ?? 0) < Date.now()) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await userRepository.update(user._id.toString(), user);

    return { message: MESSAGES.SUCCESS.OTP_VERIFIED, status: STATUS_CODES.OK };
  }

  async resendOTP(email: string): Promise<{ message: string; status: number }> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (user.isVerified) {
      throw new Error(MESSAGES.ERROR.ALREADY_VERIFIED);
    }

    const newOtp = OTPService.generateOTP();

    await OTPService.sendOTP(email, newOtp);

    console.log(newOtp);

    user.otp = newOtp;
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
    const token = jwt.sign({ userId: user._id, type: "user" }, jwtSecret, {
      expiresIn: "1h",
    });
    return {
      user: this.sanitizeUser(user),
      token,
      message: MESSAGES.SUCCESS.LOGIN,
      status: STATUS_CODES.OK,
    };
  }
    }

    export default new UserService();