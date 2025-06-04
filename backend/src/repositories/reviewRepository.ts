import Review, { IReview } from "../models/review.model";
import BaseRepository from "./base.repository";
import { IReviewRepository } from "./interfaces/IReviewRepository";

class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
    constructor(){
        super(Review)
    }


}

export default ReviewRepository;