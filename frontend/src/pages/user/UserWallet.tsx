import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  History,
  IndianRupee,
} from "lucide-react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useAuthStore } from "../../stores/authStore";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import UserLayout from "../../components/user/UserLayout";
import { IWalletWithTotals } from "../../types/wallet";

const UserWalletPage = () => {
  const user = useAuthStore((state) => state.user);
  const fetchWalletData = useAuthStore((state) => state.fetchWalletData);
  const [walletData, setWalletData] = useState<IWalletWithTotals | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const getWallet = async () => {
      if (user?.id) {
        const response = await fetchWalletData(user.id);
        if (response?.data?.transactionDetails) {
          setTransactions(response.data.transactionDetails);
        }
        if (response?.data) {
          setWalletData(response?.data);
        }
      }
    };

    getWallet();
  }, [user, fetchWalletData]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <UserLayout>
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
                {walletData?.balance && walletData.balance > 0
                  ? walletData.balance
                  : 0}
              </h2>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">**** 1234</span>
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white"
                >
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {walletData?.totalCredit}
              </h2>
              {/* <div className="text-sm text-green-600">+15% from last month</div> */}
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <ArrowDownRight className="w-8 h-8 text-red-500" />
                <span className="text-sm text-gray-500">This Month</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Debit</p>
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                -{walletData?.totalDebit}
              </h2>
              {/* <div className="text-sm text-red-600">+8% from last month</div> */}
            </Card>
          </div>

          <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <History className="w-5 h-5 text-[#b38e5d]" />
                Transaction History
              </h3>
              <Button
                variant="outline"
                className="text-sm border-gray-300 hover:border-[#b38e5d] hover:text-[#b38e5d]"
              >
                Export
              </Button>
            </div>

            <ScrollArea className="h-[400px] pr-2">
              <div className="space-y-4">
                {transactions.length > 0 ? (
                  transactions.slice(0, visibleCount).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-md ${
                            transaction.paymentType === "credit"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          <IndianRupee className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          {/* Message */}
                          <p className="text-base font-semibold text-gray-900 tracking-tight">
                            {transaction.message}
                          </p>

                          {/* Booking ID (as subtitle) */}
                          <p className="text-sm text-gray-600">
                            Booking ID:{" "}
                            <span className="font-medium text-gray-800">
                              {transaction.bookingId}
                            </span>
                          </p>

                          {/* Date and time */}
                          <p className="text-sm text-gray-500">
                            {format(
                              new Date(transaction.date),
                              "dd MMM yyyy, h:mm a"
                            )}
                          </p>

                          {/* Transaction ID styled as badge/code */}
                          <div className="mt-2">
                            <span className="inline-block text-xs font-mono text-[#b38e5d] bg-[#fdf8f3] border border-[#e5d7c0] px-2 py-1 rounded-md shadow-sm">
                              TXN: {transaction.transactionId}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold text-base ${
                            transaction.paymentType === "credit"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.paymentType === "credit" ? "+" : "-"}₹
                          {transaction.amount}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {transaction.paymentType}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-center text-gray-500 py-8">
                    No transactions found.
                  </p>
                )}
              </div>

              {/* Show more button */}
              {visibleCount < transactions.length && (
                <div className="text-center mt-4">
                  <Button
                    variant="ghost"
                    className="text-[#b38e5d] hover:underline hover:text-[#8b6d47]"
                    onClick={handleShowMore}
                  >
                    Show more ↓
                  </Button>
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserWalletPage;
