import mongoose, { Document, Schema, Types } from 'mongoose';
import { PaymentType } from './status/status';

const transactionSchema = new Schema(
  {
    transactionId:{
      type:String,
      required:true

    },
    message:{
    type:String,

    },
    bookingId: {
      type: String,
    },

    paymentType: {
      type: String,
      enum: Object.values(PaymentType),
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false } 
);

const walletSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    transactionDetails: [transactionSchema],
  },
  { timestamps: true }
);

export interface IWallet extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  balance: number;
  transactionDetails: {
    transactionId:string;
    bookingId: string;
    paymentType:PaymentType;
    date: Date;
    amount: number;
  }[];
}

const Wallet = mongoose.model<IWallet>('Wallet', walletSchema);

export default Wallet;
