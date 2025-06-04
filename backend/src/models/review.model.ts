import mongoose, { Schema, Document, Types, ObjectId } from "mongoose";

export interface IReview extends Document {
  bookingId: Types.ObjectId;
  propertyId: ObjectId;
  userId: ObjectId;
  rating: number;
  reviewText: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema: Schema = new Schema({
  bookingId: {
    type: Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  propertyId: {
    type: Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  reviewText: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });


const Review = mongoose.model<IReview>("Review", reviewSchema);
export default Review;
