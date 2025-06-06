import mongoose, { Types } from "mongoose";
import { IProperty } from "../models/property.model";
import { IPropertyService } from "./interfaces/IPropertyService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { IPropertyRepository } from "../repositories/interfaces/IPropertyRepository";
import { inject, injectable } from "inversify";
import TYPES from "../config/DI/types";
import { IFeatureRepository } from "../repositories/interfaces/IFeatureRepository";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { IOwnerRepository } from "../repositories/interfaces/IOwnerRepository";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { PropertyStatus } from "../models/status/status";
import { mapOwnerToDTO } from "../mappers/ownerMapper";
import { OwnerResponseDTO } from "../DTO/OwnerResponseDTO";
import { IReviewRepository } from "../repositories/interfaces/IReviewRepository";
import { IReviewResponse } from "../DTO/commonDTOs";

@injectable()
export class PropertyService implements IPropertyService {
  constructor(
    @inject(TYPES.PropertyRepository)
    private propertyRepository: IPropertyRepository,
    @inject(TYPES.FeatureRepository)
    private featureRepository: IFeatureRepository,
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.OwnerRepository)
    private ownerRepository: IOwnerRepository,
    @inject(TYPES.BookingRepository)
    private bookingRepository: IBookingRepository,
    @inject(TYPES.ReviewRepository)
    private reviewRepository:IReviewRepository
  ) {}
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
    
      if (!ownerId) {
        return { status: 400, message: "Owner ID is missing" };
      }
const owner = await this.ownerRepository.findOne({ _id: ownerId });
     if (owner?.allowedProperties !== undefined && owner.allowedProperties < 1) {
    await this.ownerRepository.update(ownerId, { isSubscribed: false });


  return {
    status: 400,
    message: "Maximum limit of property exceeded for adding. Please subscribe and continue",
  };
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
        const similarProperties =
          await this.propertyRepository.findSimilarProperties(
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


      const selectedFeatureIds = Array.isArray(data.selectedFeatures)
        ? data.selectedFeatures
        : data.selectedFeatures
        ? [data.selectedFeatures]
        : [];

      const featureDocs = await this.featureRepository.getFeatureNamesByIds(
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
            latitude: parsedMapLocation.lat,
            longitude: parsedMapLocation.lng,
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

      await this.propertyRepository.create(propertyData);
if (owner && typeof owner.allowedProperties === "number" && owner.allowedProperties > 0) {
  await this.ownerRepository.update(owner.id, {
    allowedProperties: owner.allowedProperties - 1,
  });
}      return { status: 201, message: "Property added successfully" };
    } catch (error) {
      console.error("Error in ownerService.addProperty:", error);
      return { status: 500, message: "Internal Server Error" };
    }
  }

  async getPropertyByOwner(
    ownerId: string,
    page: number,
    limit: number,
    searchTerm: string
  ): Promise<{
    properties: IProperty[];
    status: number;
    message: string;
    totalPages: number;
    totalProperties: number;
    currentPage: number;
  }> {
    try {
      const { properties, totalPages, totalProperties } =
        await this.ownerRepository.findOwnerProperty(
          ownerId,
          page,
          limit,
          searchTerm
        );

      return {
        properties: properties || [],
        totalPages,
        totalProperties,
        currentPage: page,
        status: STATUS_CODES.OK,
        message: "Successfully fetched",
      };
    } catch (error) {
      console.error("Error in ownerProperties:", error);
      return {
        properties: [],
        totalPages: 1,
        totalProperties: 0,
        currentPage: page,
        message: MESSAGES.ERROR.SERVER_ERROR,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async deletePropertyById(
    id: string
  ): Promise<{ status: number; message: string }> {
    try {
      await this.propertyRepository.deletePropertyById(id);

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
  async getAllProperties(page:number,limit:number,searchTerm:string): Promise<{
    properties: IProperty[];
    currentPage:number;
    totalPages:number;
    status: number;
    message: string;
  }> {
    try {
      const {properties, totalPages} =
        await this.propertyRepository.findAllPropertiesWithOwnerData(page,limit,searchTerm);

      return {
        properties: properties || [],
        currentPage:page,
        totalPages,
        status: STATUS_CODES.OK,
        message: "Successfully fetched",
      };
    } catch (error) {
      console.error("Error in property listing:", error);
      return {
        properties: [],
        currentPage:page,
        totalPages:1,
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
   const updatedProperty = await this.propertyRepository.update(id, {
      ...data,
      status: PropertyStatus.Pending
    });
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

  async getFilteredProperties(filters: any): Promise<IProperty[]> {
    try {
      const properties = await this.propertyRepository.findFilteredProperties(
        filters
      );

      return properties || [];
    } catch (error) {
      console.error("Error in PropertyService:", error);
      throw new Error("Failed to get filtered properties");
    }
  }

  async approveProperty(
    id: string
  ): Promise<{ status: number; message: string }> {
    try {
      await this.propertyRepository.approveProperty(id);

      return {
        status: STATUS_CODES.OK,
        message: "Property approved successfully",
      };
    } catch (error) {
      console.error("Error approving property:", error);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }

  async blockUnblockProperty(
    id: string,
    status: string
  ): Promise<{ status: number; message: string }> {
    try {
      await this.propertyRepository.blockUnblockProperty(id, status);

      return {
        status: STATUS_CODES.OK,
        message: `Property status updated to ${status}`,
      };
    } catch (error) {
      console.error("Error updating property status:", error);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }

  async deleteProperty(
    id: string
  ): Promise<{ status: number; message: string }> {
    try {
      await this.propertyRepository.deleteProperty(id);

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

  async rejectProperty(
    id: string,
    reason: string
  ): Promise<{ message: string; status: number }> {
    try {
      const property = await this.propertyRepository.findById(id);
      if (!property) {
        return {
          message: "property not found",
          status: STATUS_CODES.NOT_FOUND,
        };
      }

      const updatedData: Partial<IProperty> = {
        isRejected: true,
        rejectedReason: reason,
        status: PropertyStatus.Rejected,
      };
      // const ownerId=new mongoose.Types.ObjectId(property.ownerId);
      // const owner=await ownerRepository.findById(ownerId);

      // await ownerRepository.update(id, {
      //   govtIdStatus: "rejected",
      //   rejectionReason: reason,
      // });

      // await Mail.sendRejectionMail(owner.email, reason);
      const response = await this.propertyRepository.update(id, updatedData);

      return {
        message: "Rejected successfully & email sent",
        status: STATUS_CODES.OK,
      };
    } catch (error) {
      console.error("Error rejecting owner:", error);
      return {
        message: "Internal Server Error",
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      };
    }
  }
  async getPropertyById(
    id: string
  ): Promise<{
    property: any;
    ownerData: OwnerResponseDTO | null;
    booking: any;
    status: number;
    message: string;
  }> {
    try {
      const property = (await this.propertyRepository.findPropertyById(
        id
      )) as IProperty;

      if (!property) {
        throw new Error("Property not available");
      }

      if (!property) {
        return {
          property: null,
          booking: null,
          ownerData: null,
          status: STATUS_CODES.NOT_FOUND,
          message: "Property not found",
        };
      }

      const ownerId = property.ownerId.toString();
      const owner = await this.ownerRepository.findById(ownerId);
      let ownerDTO = null;

      if (owner) {
        ownerDTO = mapOwnerToDTO(owner);
      }

      const booking = await this.bookingRepository.findPropertyBookings(id);
      return {
        property,
        booking,
        ownerData: ownerDTO,
        status: STATUS_CODES.OK,
        message: "Property fetched successfully",
      };
    } catch (error) {
      console.error("Error in getPropertyById:", error);
      return {
        property: null,
        ownerData: null,
        booking: null,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }


async addReview(
  bookingId: string,
  rating: number,
  reviewText: string
): Promise<{ status: number; message: string }> {
  try {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      return {
        status: STATUS_CODES.NOT_FOUND,
        message: "Booking not found.",
      };
    }

    if (booking.bookingStatus !== "completed") {
      return {
        status: STATUS_CODES.BAD_REQUEST,
        message: "Only completed bookings can be reviewed.",
      };
    }

    const existingReview = await this.reviewRepository.findOne({ bookingId });

    if (existingReview) {
      return {
        status: STATUS_CODES.CONFLICT,
        message: "You have already submitted a review for this booking.",
      };
    }

await this.reviewRepository.create({
  bookingId: new Types.ObjectId(bookingId),
  propertyId: booking.propertyId,
  userId: booking.userId,
  rating,
  reviewText,
});
const reviews = await this.reviewRepository.find({ propertyId: booking.propertyId });
const totalReviews = reviews.length;
const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
const averageRating = totalRating / totalReviews;

await this.propertyRepository.updateRatingAndReviewCount(
  booking.propertyId.toString(), 
  averageRating,
  totalReviews
);
    return {
      status: STATUS_CODES.CREATED,
      message: "Review added successfully.",
    };
  } catch (error) {
    console.error("Error adding review:", error);
    return {
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: "Failed to add review.",
    };
  }
}
async getReviews(propertyId: string): Promise<{ reviews: IReviewResponse[]; status: number; message: string; }> {
  try {
    const reviews = await this.reviewRepository.findReviews(propertyId);
      return {
      reviews,
      status: STATUS_CODES.OK,
      message: "Review fetched successfully.",
    };
  } catch (error) {
     console.error("Error adding review:", error);
    return {
      reviews:[],
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch review.",
    };
  }
}

}

export default PropertyService;
