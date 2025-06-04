import { AddressDTO } from "./UserResponseDto";

export interface OwnerResponseDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  isVerified: boolean;
  govtId: string;
  govtIdStatus: string;
  rejectionReason?: string | null;
  address: AddressDTO;
  isSubscribed: boolean;
  subscriptionStart: Date | null;
  subscriptionEnd: Date | null;
  createdAt: Date;
  updatedAt: Date;
}