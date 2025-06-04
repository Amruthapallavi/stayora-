import mongoose from "mongoose";
import Wallet, { IWallet } from "../models/wallet.model";
import BaseRepository from "./base.repository";
import { IWalletRepository } from "./interfaces/IWalletRepository";
import { injectable } from "inversify";

@injectable()
class walletRepository extends BaseRepository<IWallet> implements IWalletRepository {
    constructor() {
    super(Wallet);
  }
  async updateUserWalletTransaction(
    userId: string,
    bookingId: string,
    amount: number,
    type: 'credit' | 'debit',
    transactionId:string,
  ) {
    const transactionDate = new Date();
    const increment = type === 'debit' ? -amount : amount;

    const result = await Wallet.findOneAndUpdate(
      { userId },
      {
        $inc: { balance: increment },
        $push: {
          transactionDetails: {
            bookingId,
            paymentType: type,
            date: transactionDate,
            amount,
            transactionId,
          },
        },
      },
      { upsert: true, new: true }
    );

    return result;
  }

async fetchWalletData(userId: string): Promise<IWallet | null> {
  const wallet = await Wallet.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!wallet) return null;

  wallet.transactionDetails.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return wallet;
}



}

export default walletRepository;