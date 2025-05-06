import { IOwner } from "../../models/owner.model";
import { IFeature } from "../../models/features.model";
import { IProperty } from "../../models/property.model";
import { IBaseRepository } from "./IBaseRepository";
import { IBooking } from "../../models/booking.model";

export interface IOwnerRepository extends IBaseRepository<IOwner> {
  findByEmail(email: string): Promise<IOwner | null>;
  findFeatures(): Promise<IFeature[]>;
  findOwnerProperty(ownerId: string): Promise<IProperty[]>;
  getFeatureNamesByIds(ids: string[]): Promise<IFeature[]>;
  findUserById(id: string): Promise<IOwner | null>;
  findPropertyById(id: string): Promise<IProperty | null>;
  updateRefreshToken(ownerId: string, refreshToken: string): Promise<any>;
  getPropertiesByOwner(ownerId: string): Promise<IProperty[]>;
  getBookingsByPropertyIds(propertyIds: string[]): Promise<IBooking[]>;
  bookingsByMonth(ownerId: string): Promise<{ name: string; bookings: number; revenue: number }[]>;
}
