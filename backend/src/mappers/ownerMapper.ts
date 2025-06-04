import { OwnerResponseDTO } from "../DTO/OwnerResponseDTO";
import { IOwner } from "../models/owner.model";

export const mapOwnerToDTO = (owner: IOwner): OwnerResponseDTO => ({
  id: owner._id.toString(),
  name: owner.name,
  email: owner.email,
  phone: owner.phone,
  status: owner.status,
  isVerified: owner.isVerified,
  govtId: owner.govtId,
  govtIdStatus: owner.govtIdStatus,
  rejectionReason: owner.rejectionReason,
  address: {
    houseNo: owner.address.houseNo,
    street: owner.address.street,
    city: owner.address.city,
    district: owner.address.district,
    state: owner.address.state,
    pincode: owner.address.pincode,
  },
  isSubscribed: owner.isSubscribed,
  subscriptionStart: owner.subscriptionStart,
  subscriptionEnd: owner.subscriptionEnd,
  createdAt: owner.createdAt,
  updatedAt: owner.updatedAt,
});

export const mapOwnersToDTOs = (owners: IOwner[]): OwnerResponseDTO[] =>
  owners.map(mapOwnerToDTO);