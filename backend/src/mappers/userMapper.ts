
import { IUser } from "../models/user.model";
import { UserResponseDTO } from "../DTO/UserResponseDto";

export const mapUserToDTO = (user: IUser): UserResponseDTO => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  phone: user.phone,
  status: user.status,
  isVerified: user.isVerified,
  role: user.role,
  address: user.address
    ? {
        houseNo: user.address.houseNo,
        street: user.address.street,
        city: user.address.city,
        district: user.address.district,
        state: user.address.state,
        pincode: user.address.pincode,
      }
    : undefined,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const mapUsersToDTOs = (users: IUser[]): UserResponseDTO[] =>
  users.map(mapUserToDTO);
