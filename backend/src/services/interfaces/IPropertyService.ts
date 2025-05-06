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

  getPropertyByOwner(ownerId: string): Promise<{
    properties: any[];
    status: number;
    message: string;
  }>;

  deletePropertyById(id: string): Promise<{ status: number; message: string }>;

  getAllProperties(): Promise<{
    properties: IProperty[];
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

  getFilteredProperties(filters: any): Promise<any>;

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
    property: any;
    ownerData: any;
    booking: any;
    status: number;
    message: string;
  }>;
}
