import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import OTPService from "../utils/OTPService";

import ownerRepository from "../repositories/owner.repository";
import { IOwner } from "../models/owner.model";
import { IOwnerService } from "./interfaces/IOwnerService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import Property ,{IProperty} from "../models/property.model"
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
        status:'Pending',
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
  ): Promise<{ owner: IOwner;user:IOwner; token: string; message: string; status: number }> {
    console.log(email,"email")
    const owner = await ownerRepository.findByEmail(email);
    console.log(owner,"login owner")
    if (!owner) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    if (owner.status==="Blocked") {
      throw new Error(MESSAGES.ERROR.BLOCKED_USER);
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
      user:owner,
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

    async getProfileData(id: string): Promise<{ user: any; status: number; message: string }> {
      try {
        const user = await ownerRepository.findById(id);
    
        if (!user) {
          return {
            user: null,
            status: STATUS_CODES.NOT_FOUND,
            message: "User not found",
          };
        }
    
        return {
          user,
          status: STATUS_CODES.OK,
          message: "Successfully fetched",
        };
      } catch (error) {
        console.error("Error in getProfileData:", error);
        return {
          user: null,
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: MESSAGES.ERROR.SERVER_ERROR,
        };
      }
    }
    
    async updateProfile(
      id: string,
      updatedData: Record<string, any>
    ): Promise<{ message: string; status: number }> {
      try {
        if (!id) {
          return {
            message: "Invalid user ID",
            status: STATUS_CODES.BAD_REQUEST,
          };
        }
    
        const user = await ownerRepository.findById(id);
        if (!user) {
          return {
            message: "User not found",
            status: STATUS_CODES.NOT_FOUND,
          };
        }
    console.log(updatedData);
        // Merge new data
        user.name=updatedData.data.name;
        user.phone=updatedData.data.phone;
        user.address=updatedData.data.address;
        await user.save();
    
        return {
          message: "Profile updated successfully",
          status: STATUS_CODES.OK,
        };
      } catch (error) {
        console.error("Error updating profile:", error);
        return {
          message: "Internal Server Error",
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        };
      }
    }

    async addProperty(req: { 
      data: { 
        data: Partial<IProperty> & { 
          selectedImages?: string[]; 
          selectedFeatures?: string[]; 
          addedOtherFeatures?: string[]; 
        }; 
      }; 
      ownerId: string; 
    }): Promise<{ status: number; message: string }> {
      try {
        const { data, ownerId } = req;
    
        console.log("Received Data:", data);
    
        if (!ownerId) {
          return { status: 400, message: "Owner ID is missing" };
        }
    
        const propertyData = data.data;
    
        // Required Fields Validation
        if (
          !propertyData || 
          !propertyData.title || 
          !propertyData.rentPerMonth || 
          !propertyData.type || 
          !propertyData.description || 
          !propertyData.bedrooms || 
          !propertyData.bathrooms || 
          !propertyData.furnishing || 
          !propertyData.minLeasePeriod || 
          !propertyData.maxLeasePeriod || 
          !propertyData.address  
          // !propertyData.city || 
          // !propertyData.district || 
          // !propertyData.state || 
          // !propertyData.pincode
        ) {
          return { status: 400, message: "Missing required fields" };
        }
    
        console.log("Validation passed");
    
        // Validate Image URLs
        const validImages = propertyData.selectedImages?.filter(img => img.startsWith("http")) || [];
        console.log(validImages, "Valid Images");
    
        // Combine selected features and additional features
        const features = [
          ...(propertyData.selectedFeatures || []),
          ...(propertyData.addedOtherFeatures || [])
        ];
    
        // Construct new property object
        const newProperty = new Property({
          ownerId,
          title: propertyData.title.trim(),
          type: propertyData.type.trim(),
          description: propertyData.description.trim(),
          category: propertyData.category || null, // Assign category if provided
    
          location: propertyData.location || {
            place: "",
            coordinates: { latitude: null, longitude: null },
          },
    
          // Properly save address structure
          address: {
            houseNo: propertyData.houseNumber.trim(),
            street: propertyData.street.trim(),
            city: propertyData.city.trim(),
            district: propertyData.district.trim(),
            state: propertyData.state.trim(),
            pincode: Number(propertyData.pincode), // Convert to number
          },
    
          bedrooms: Number(propertyData.bedrooms),
          bathrooms: Number(propertyData.bathrooms),
          furnishing: propertyData.furnishing,
          rentPerMonth: Number(propertyData.rentPerMonth),
    
          images: validImages,
          minLeasePeriod: Number(propertyData.minLeasePeriod),
          maxLeasePeriod: Number(propertyData.maxLeasePeriod),
          rules: propertyData.rules || "",
          cancellationPolicy: propertyData.cancellationPolicy || "",
          features
        });
    
        // Save to database
        await newProperty.save();
    
        return { status: 201, message: "Property added successfully" };
      } catch (error) {
        console.error("Error in ownerService.addProperty:", error);
        return { status: 500, message: "Internal Server Error" };
      }
    }
    
    
    
    

 async listFeatures(): Promise<{ features: any[]; status: number; message:string }> {
    try {
      const features = await ownerRepository.findFeatures();

    console.log(features)
    return {
      features,
      status: STATUS_CODES.OK,
      message:"successfully fetched"
    };
    } catch (error) {
      console.error("Error in listServices:", error);
      return { 
        features: [], 
        message: MESSAGES.ERROR.SERVER_ERROR, 
        status: STATUS_CODES.INTERNAL_SERVER_ERROR 
    }
  }

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