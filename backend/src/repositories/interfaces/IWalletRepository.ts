import { IWallet } from "../../models/wallet.model";
import { IBaseRepository } from "./IBaseRepository";


export interface IWalletRepository extends IBaseRepository<IWallet>{
    updateUserWalletTransaction(
        userId: string,
        bookingId: string,
        amount: number,
        type: 'credit' | 'debit',
        transactionId:string,
      ): Promise<IWallet | null>;    
  fetchWalletData(userId: string): Promise<IWallet | null>;

}