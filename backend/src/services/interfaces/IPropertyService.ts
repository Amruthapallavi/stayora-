import { IReviewResponse } from "../../DTO/commonDTOs";
import { OwnerResponseDTO } from "../../DTO/OwnerResponseDTO";
import { IBooking } from "../../models/booking.model";
import { IProperty } from "../../models/property.model";

export interface ICreatePropertyInput {
  data: Partial<IProperty> & {
    selectedFeatures?: string[];
    addedOtherFeatures?: string[];
    mapLocation?: string | { lat: number; lng: number };
  };
  ownerId: string;
  images?: string[];
}

export interface IPropertyService {
  createProperty(req: ICreatePropertyInput): Promise<{ status: number; message: string }>;

  getPropertyByOwner(ownerId: string,page:number,limit:number,searchTerm?:string): Promise<{
    properties: IProperty[];
    totalPages:number,
              totalProperties:number,
              currentPage:number,
    status: number;
    message: string;
  }>;

  deletePropertyById(id: string): Promise<{ status: number; message: string }>;

  getAllProperties(page:number,limit:number,searchTerm?:string): Promise<{
    properties: IProperty[];
    currentPage:number;
    totalPages:number;
    status: number;
    message: string;
  }>;

  updateProperty(
    id: string,
    data: Partial<IProperty>
  ): Promise<{
    data: IProperty | null;
    status: number;
    message: string;
  }>;
getReviews(propertyId:string):Promise<{reviews:IReviewResponse[],status:number,message:string}>;
  getFilteredProperties(filters: any): Promise<IProperty[]>;
addReview(
  bookingId: string,
  rating: number,
  reviewText: string
): Promise<{ status: number; message: string }>;
  approveProperty(id: string): Promise<{ status: number; message: string }>;

  blockUnblockProperty(id: string, status: string): Promise<{
    status: number;
    message: string;
  }>;

  deleteProperty(id: string): Promise<{ status: number; message: string }>;

  rejectProperty(id: string, reason: string): Promise<{
    message: string;
    status: number;
  }>;

  getPropertyById(id: string): Promise<{
    property: IProperty;
    ownerData: OwnerResponseDTO |null;
    booking: IBooking;
    status: number;
    message: string;
  }>;
}
