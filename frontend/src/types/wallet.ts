export   interface IWalletWithTotals {
    userId: string;
    balance: number;
    transactionDetails: {
      paymentType: 'credit' | 'debit';
      amount: number;
      bookingId: string;
      date: Date;
    }[];
    totalDebit: number;
    totalCredit: number;
  }
  export interface WalletData{
    data:IWalletWithTotals;
    message?:string;
  }

  export interface TransactionDetail {
    id?:string;
  paymentType: "credit" | "debit";
  amount: number;
  bookingId: string;
  date: Date;
};
