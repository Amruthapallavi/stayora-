
export interface AddressDTO {
  houseNo: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  isVerified: boolean;
  role: string;
  address?: AddressDTO;
  createdAt: Date;
  updatedAt: Date;
}
