import { Types } from "mongoose";
import { IProperty } from "../models/property.model";
import featureRepository from "../repositories/feature.repository";
import ownerRepository from "../repositories/owner.repository";
import propertyRepository from "../repositories/property.repository";
import { IPropertyService } from "./interfaces/IPropertyService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import adminRepository from "../repositories/admin.repository";



class propertyService implements IPropertyService{

    async createProperty(req: {
        data: Partial<IProperty> & {
          selectedFeatures?: string[];
          addedOtherFeatures?: string[];
        };
        ownerId: string;
        images?: string[];
      }): Promise<{ status: number; message: string }> {
        try {
          const { data, ownerId, images } = req;
          console.log(data, "from service addproperty");
      
          if (!ownerId) {
            return { status: 400, message: "Owner ID is missing" };
          }
      
          if (
            !data.title ||
            !data.rentPerMonth ||
            !data.type ||
            !data.description ||
            !data.bedrooms ||
            !data.bathrooms ||
            !data.furnishing ||
            !data.minLeasePeriod ||
            !data.maxLeasePeriod ||
            !data.address ||
            !data.houseNumber ||
            !data.street ||
            !data.city ||
            !data.district ||
            !data.state ||
            !data.pincode
          ) {
            return { status: 400, message: "Missing required fields" };
          }
      
          const parsedMapLocation =
            typeof data.mapLocation === "string"
              ? JSON.parse(data.mapLocation)
              : data.mapLocation;
      
          if (data.title && parsedMapLocation?.lat && parsedMapLocation?.lng) {
            const similarProperties = await propertyRepository.findSimilarProperties(
              data.title.trim(),
              {
                latitude: parsedMapLocation.lat,
                longitude: parsedMapLocation.lng,
              }
            );
      
            if (similarProperties && similarProperties.length > 0) {
              return {
                status: 409,
                message:
                  "A similar property with this title already exists at the same location",
              };
            }
          }
      
          console.log(data.mapLocation, "location");
      
          const selectedFeatureIds = Array.isArray(data.selectedFeatures)
            ? data.selectedFeatures
            : data.selectedFeatures
            ? [data.selectedFeatures]
            : [];
      
          const featureDocs = await featureRepository.getFeatureNamesByIds(
            selectedFeatureIds
          );
      
          const selectedFeatureNames = featureDocs.map((f: any) => f.name);
      
          const propertyData: Partial<IProperty> = {
            ownerId: new Types.ObjectId(ownerId),
            title: data.title.trim(),
            type: data.type.trim(),
            description: data.description.trim(),
            category: data.category ? new Types.ObjectId(data.category) : null,
            mapLocation: {
              coordinates: {
                latitude: parsedMapLocation?.lat,
                longitude: parsedMapLocation?.lng,
              },
            },
            address: data.address?.trim() || "",
            houseNumber: data.houseNumber?.trim() || "",
            street: data.street?.trim() || "",
            city: data.city?.trim() || "",
            district: data.district?.trim() || "",
            state: data.state?.trim() || "",
            pincode: Number(data.pincode),
            bedrooms: Number(data.bedrooms),
            bathrooms: Number(data.bathrooms),
            furnishing: data.furnishing,
            rentPerMonth: Number(data.rentPerMonth),
            minLeasePeriod: Number(data.minLeasePeriod),
            maxLeasePeriod: Number(data.maxLeasePeriod),
            rules: data.rules || "",
            cancellationPolicy: data.cancellationPolicy || "",
            features: selectedFeatureNames,
            otherFeatures: data.addedOtherFeatures || [],
            images: images || [],
          };
      
          await propertyRepository.create(propertyData);
      
          return { status: 201, message: "Property added successfully" };
        } catch (error) {
          console.error("Error in ownerService.addProperty:", error);
          return { status: 500, message: "Internal Server Error" };
        }
      }

      
        async getPropertyByOwner(
          ownerId: string
        ): Promise<{ properties: any[]; status: number; message: string }> {
          try {
            const properties = await ownerRepository.findOwnerProperty(ownerId);
        
            return {
              properties: properties || [], 
              status: STATUS_CODES.OK,
              message: "Successfully fetched",
            };
          } catch (error) {
            console.error("Error in ownerProperties:", error);
            return {
              properties: [], 
              message: MESSAGES.ERROR.SERVER_ERROR,
              status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            };
          }
        }
        

           async deletePropertyById(id: string): Promise<{ status: number; message: string }> {
                  try {
                    console.log("delete")
                    await propertyRepository.deletePropertyById(id);
                
                    return {
                      status: STATUS_CODES.OK,
                      message: "Property deleted successfully",
                    };
                  } catch (error) {
                    console.error("Error deleting property:", error);
                    return {
                      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                      message: MESSAGES.ERROR.SERVER_ERROR,
                    };
                  }
                }
            async getAllProperties(): Promise<{ properties: IProperty[]; status: number; message: string }> {
                try {
                  const properties = await propertyRepository.findAllPropertiesWithOwnerData();
              
                  return {
                    properties: properties || [], 
                    status: STATUS_CODES.OK,
                    message: "Successfully fetched",
                  };
                } catch (error) {
                  console.error("Error in property listing:", error);
                  return {
                    properties: [], 
                    message: MESSAGES.ERROR.SERVER_ERROR,
                    status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                  };
                }
              }

              async updateProperty(
                id: string,
                data: Partial<IProperty>
              ): Promise<{ data: IProperty | null; status: number; message: string }> {
                try {
                  const updatedProperty = await propertyRepository.update(id, data);
              
                  if (!updatedProperty) {
                    return {
                      data: null,
                      status: STATUS_CODES.NOT_FOUND,
                      message: "Property not found",
                    };
                  }
              
                  return {
                    data: updatedProperty,
                    status: STATUS_CODES.OK,
                    message: "Property updated successfully",
                  };
                } catch (error) {
                  console.error("Error in updating property:", error);
                  return {
                    data: null,
                    status: STATUS_CODES.INTERNAL_SERVER_ERROR,
                    message: MESSAGES.ERROR.SERVER_ERROR,
                  };
                }
              }

              async getFilteredProperties(filters: any) {
                try {
                  const properties = await propertyRepository.findFilteredProperties(filters);
                  console.log("properties filtered",properties)
                  if (!properties) {
                    return {
                      properties: null,
                      status: STATUS_CODES.NOT_FOUND,
                      message: "Property not found",
                    };
                  }
                  return properties;
                } catch (error) {
                  console.error('Error in PropertyService:', error);
                  throw new Error('Failed to get filtered properties');
                }
              }
              
      
      
      
}

export default new propertyService();