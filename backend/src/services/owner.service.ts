import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import OTPService from "../utils/OTPService";

import ownerRepository from "../repositories/owner.repository";
import { IOwner } from "../models/owner.model";
import { IOwnerService } from "./interfaces/IOwnerService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";

interface SignupData extends Partial<IOwner> {
    confirmPassword?: string;
  }
  
  class OwnerService implements IOwnerService {
    private sanitizeUser(user: IOwner) {
        
      const { password, otp, __v, ...sanitizedUser } = user.toObject();
      return sanitizedUser;
    }

    async registerOwner(
      ownerData: SignupData
    ): Promise<{ message: string; status: number }> {
      const { name, email, password, confirmPassword, phone, govtId } = ownerData;
    
      // Ensure all required fields are provided
      if (!name || !email || !password || !confirmPassword || !phone || !govtId) {
        throw new Error(MESSAGES.ERROR.INVALID_INPUT);
      }
    
      if (password !== confirmPassword) {
        throw new Error(MESSAGES.ERROR.PASSWORD_MISMATCH);
      }
    
      // Check if email is already registered
      const existingOwner = await ownerRepository.findByEmail(email);
      if (existingOwner) {
        throw new Error(MESSAGES.ERROR.EMAIL_EXISTS);
      }
    
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
    
      // Generate OTP for email verification
      const otp = OTPService.generateOTP();
      console.log(otp, "owner otp");
    
      await OTPService.sendOTP(email, otp);
      console.log("Sent OTP:", otp, "to email:", email);
    
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 mins
    
      // Save the new owner in the database
      await ownerRepository.create({
        ...ownerData,
        govtIdStatus:'pending',
        password: hashedPassword,
        isVerified: false,
        otp,
        otpExpires,
        govtId, // Save Cloudinary URL of Govt ID proof
      });
    
      return { message: MESSAGES.SUCCESS.SIGNUP, status: STATUS_CODES.CREATED };
    }
    

  async verifyOTP(
    email: string,
    otp: string
  ): Promise<{ message: string; status: number }> {
    console.log(email,"email")
    const owner = await ownerRepository.findByEmail(email);
    console.log(owner,"owner")
    if (!owner) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }
    console.log(owner.otp, otp )
    console.log(owner.otpExpires?.getTime(),  "date now", Date.now());
    if (owner.otp !== otp || (owner.otpExpires?.getTime() ?? 0) < Date.now()) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }
    owner.isVerified = true;
    owner.otp = undefined;
    owner.status='Active';
    owner.otpExpires = null;

    await ownerRepository.update(owner._id.toString(), owner);

    return { message: MESSAGES.SUCCESS.OTP_VERIFIED, status: STATUS_CODES.OK };
  }

  async resendOTP(email: string): Promise<{ message: string; status: number }> {
    const owner = await ownerRepository.findByEmail(email);
    console.log(owner,"owner")
    if (!owner) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    // if (owner.isVerified) {
    //   throw new Error(MESSAGES.ERROR.ALREADY_VERIFIED);
    // }

    const newOtp = OTPService.generateOTP();

    await OTPService.sendOTP(email, newOtp);

    console.log(newOtp);

    owner.otp = newOtp;
    owner.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 10 minutes from now

    await ownerRepository.update(owner._id.toString(), owner);

    return { message: MESSAGES.SUCCESS.OTP_RESENT, status: STATUS_CODES.OK };
  }
  
  async loginOwner(
    email: string,
    password: string
  ): Promise<{ owner: IOwner; token: string; message: string; status: number }> {
    console.log(email,"email")
    const owner = await ownerRepository.findByEmail(email);
    console.log(owner,"login owner")
    if (!owner) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    if (!owner.isVerified) {
      throw new Error(MESSAGES.ERROR.NOT_VERIFIED);
    }
    if (!owner.password) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }
    const isPasswordValid = await bcrypt.compare(password, owner.password);
    if (!isPasswordValid) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }
    const token = jwt.sign({ ownerId: owner._id, type: "owner" }, jwtSecret, {
      expiresIn: "1h",
    });

    return {
      owner: this.sanitizeUser(owner),
      token,
      message: MESSAGES.SUCCESS.LOGIN,
      status: STATUS_CODES.OK,
    };
  }


  async resetPassword(
      email:string,
      newPassword:string
    ):Promise<{ message:string; status: number}> {
      const owner = await ownerRepository.findByEmail(email);
      if(!owner){
        throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update user password and clear OTP fields
      owner.password = hashedPassword;
      owner.otp = null; // Ensure OTP cannot be reused
      owner.otpExpires = null;
      owner.isVerified = true; // Ensure user is marked as verified
  
      await ownerRepository.update(owner._id.toString(), owner);
      return { message: MESSAGES.SUCCESS.PASSWORD_RESET, status: STATUS_CODES.OK };
  
    }

//   async processGoogleAuth(
//     profile: any
//   ): Promise<{ user: IUser; token: string; message: string; status: number }> {
//     const email = profile.email;
//     let user = await userRepository.findByEmail(email);
//     if (user) {
//       if (!user.googleId) {
//         user.googleId = profile.id;
//         await userRepository.update(user._id.toString(), user);
//       }
//     } else {
//       user = await userRepository.create({
//         googleId: profile.id,
//         name: profile.displayName,
//         email,
//         password: "",
//         isVerified: true,
//       });
//     }
//     const jwtSecret = process.env.JWT_SECRET;
//     if (!jwtSecret) {
//       throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
//     }
//     const token = jwt.sign({ userId: user._id, type: "user" }, jwtSecret, {
//       expiresIn: "1h",
//     });
//     return {
//       user: this.sanitizeUser(user),
//       token,
//       message: MESSAGES.SUCCESS.LOGIN,
//       status: STATUS_CODES.OK,
//     };
//   }
    }

    export default new OwnerService();