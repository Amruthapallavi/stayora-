import { IWallet } from "../../models/wallet.model";
import { IBaseRepository } from "./IBaseRepository";


export interface IWalletRepository extends IBaseRepository<IWallet>{
    // findAllServices(): Promise<IService[] | null>;
    
}