import { IProperty } from "../../models/property.model";

export interface IPropertyService {
  createProperty(req: {
    data: Partial<IProperty> & {
      selectedFeatures?: string[];
      addedOtherFeatures?: string[];
      mapLocation?: any;
    };
    ownerId: string;
    images?: string[];
  }): Promise<{
    status: number;
    message: string;
  }>;

  getPropertyByOwner(ownerId:string):Promise<{status:number,message:string,properties:IProperty[]}>
  deletePropertyById(propertyId:string):Promise<{status:number,message:string}>;
  getAllProperties():Promise<{status:number,message:string,properties:IProperty[] |null}>;
}













// createVenue(
//     vendorId: string,
//     venueData: Partial<IVenue>
//   ): Promise<{ message: string; status: number; venue: IVenue }>;