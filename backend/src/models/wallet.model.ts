import mongoose, { Document, Schema, Types } from 'mongoose';

const transactionSchema = new Schema(
  {
    bookingId: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ['credit', 'debit'],
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

// TypeScript Interface
export interface IWallet extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  balance: number;
  transactionDetails: {
    bookingId: string;
    paymentType: 'credit' | 'debit';
    date: Date;
    amount: number;
  }[];
}

const Wallet = mongoose.model<IWallet>('Wallet', walletSchema);

export default Wallet;
