import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  History,
  DollarSign,
  IndianRupee
} from 'lucide-react';
import { ScrollArea } from "../../components/ui/scroll-area";
import { useAuthStore } from "../../stores/authStore";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import UserLayout from "../../components/user/UserLayout";
import OwnerLayout from "../../components/owner/OwnerLayout";

const OwnerWalletPage = () => {
  const user = useAuthStore((state) => state.user); // assuming user contains `_id`
  const fetchWalletData = useAuthStore((state) => state.fetchWalletData);
  const [walletData, setWalletData] = useState(null);
  const [transactions,setTransactions]=useState<any[]>([]);
  useEffect(() => {
    const getWallet = async () => {
      if (user?.id) {
        const response = await fetchWalletData(user.id); 
        console.log(response,"hiut");
        setTransactions(response?.data.transactionDetails);
        if (response?.data) {
          setWalletData(response?.data); // set the fetched wallet data to local state
        }
      }
    };

    getWallet();
  }, [user, fetchWalletData]);


  return (
    <OwnerLayout>
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Wallet</h1>
        
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-[#b38e5d] to-[#b38e5d] text-white">
        <div className="flex items-center justify-between mb-4">
              <Wallet className="w-8 h-8" />
              <CreditCard className="w-6 h-6" />
            </div>
            <p className="text-sm opacity-90 mb-1">Available Balance</p>
            <h2 className="text-3xl font-bold mb-4">
  {walletData?.balance && walletData.balance > 0 ? walletData.balance : 0}
</h2>
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-90">**** 1234</span>
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                <Plus className="w-4 h-4 mr-2" /> Add Money
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <ArrowUpRight className="w-8 h-8 text-green-500" />
              <span className="text-sm text-gray-500">This Month</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Credit</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{walletData?.totalCredit}</h2>
            {/* <div className="text-sm text-green-600">+15% from last month</div> */}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <ArrowDownRight className="w-8 h-8 text-red-500" />
              <span className="text-sm text-gray-500">This Month</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Debit</p>
            <h2 className="text-2xl font-bold text-red-600 mb-4">-{walletData?.totalDebit}</h2>
            {/* <div className="text-sm text-red-600">+8% from last month</div> */}
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center">
              <History className="w-5 h-5 mr-2" /> Transaction History
            </h3>
            <Button variant="outline">Export</Button>
          </div>

          <ScrollArea className="h-[400px] rounded-md">
          <div className="space-y-4">
  {transactions.length > 0 ? (
    transactions.map((transaction) => (
      <div
        key={transaction.id}
        className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="flex items-center space-x-4">
          <div className={`p-2 rounded-full ${
            transaction.paymentType === 'credit' 
              ? 'bg-green-100 text-green-600' 
              : 'bg-red-100 text-red-600'
          }`}>
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{transaction.bookingId}</p>
            <p className="text-sm text-gray-500">  {format(new Date(transaction.date), 'dd MMM yyyy, h:mm a')}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-semibold ${
            transaction.paymentType === 'credit' 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {transaction.paymentType === 'credit' ? '+' : '-'}${transaction.amount}
          </p>
          <p className="text-sm text-gray-500 capitalize">{transaction.paymentType}</p>
        </div>
      </div>
    ))
  ) : (
    <p className="text-sm text-gray-500 text-center">No transactions found.</p>
  )}
</div>

          </ScrollArea>
        </Card>
      </div>
    </div>
    </OwnerLayout>
  );
};

export default OwnerWalletPage;
