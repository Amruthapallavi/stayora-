import { IReviewResponse } from "../DTO/commonDTOs";
import Review, { IReview } from "../models/review.model";
import BaseRepository from "./base.repository";
import { IReviewRepository } from "./interfaces/IReviewRepository";

class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
    constructor(){
        super(Review)
    }

async  findReviews(propertyId: string): Promise<IReviewResponse[]> {
  return await Review.find({ propertyId })
    .populate({
      path: 'userId',
      select: 'name email',
    })
    .select('createdAt reviewText rating userId')
    .sort({ createdAt: -1 })
    .lean<IReviewResponse[]>(); 
}

    } 

export default ReviewRepository;