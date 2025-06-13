import { IReviewUserResponse } from "../../DTO/BookingResponseDTO";
import { IReviewResponse } from "../../DTO/commonDTOs";
import { IReview } from "../../models/review.model";
import { IBaseRepository } from "./IBaseRepository";


export interface IReviewRepository extends IBaseRepository<IReview> {
  findReviews(propertyId: string): Promise<IReviewResponse[] | []>;
  findReviewByUser(bookingId:string,userId:string):Promise<IReviewUserResponse | null>;
}