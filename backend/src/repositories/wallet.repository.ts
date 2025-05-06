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
    type: 'credit' | 'debit'
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
          },
        },
      },
      { upsert: true, new: true }
    );

    return result;
  }


}

export default walletRepository;