import mongoose from "mongoose";
import { IReviewResponse } from "../DTO/commonDTOs";
import Review, { IReview } from "../models/review.model";
import BaseRepository from "./base.repository";
import { IReviewRepository } from "./interfaces/IReviewRepository";
import { IReviewUserResponse } from "../DTO/BookingResponseDTO";

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
async findReviewByUser(bookingId: string, userId: string) {
 try {
    const review = await Review.findOne({
      bookingId: new mongoose.Types.ObjectId(bookingId),
      userId: new mongoose.Types.ObjectId(userId),
    })
      .populate({
        path: 'userId',
        select: 'name email',
      })
      .select('createdAt reviewText rating userId bookingId')
      .lean<IReviewUserResponse | null>(); 

    return review;
  } catch (error) {
    console.error('Error in findReviewByUser:', error);
    throw new Error('Database query failed');
  }
}

    } 

export default ReviewRepository;