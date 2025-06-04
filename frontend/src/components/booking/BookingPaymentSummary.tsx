import { Card } from "../../components/ui/card";
import { IndianRupee, Clock, PackageOpen, CheckCircle, CreditCard, CircleCheck } from "lucide-react";

interface BookingPaymentSummaryProps {
  monthlyRent: number;
  duration: string;
  totalAmount: number;
  addOnservice: string[];
  addOnCost: number;
  paymentMethod: string;
  paymentStatus: string;
}

const BookingPaymentSummary = ({
  monthlyRent,
  duration,
  totalAmount,
  addOnservice,
  addOnCost,
  paymentMethod,
  paymentStatus,
}: BookingPaymentSummaryProps) => {
  return (
    <Card className="relative p-8 bg-gradient-to-br from-white via-[#b38e5d]/3 to-[#b38e5d]/8 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden">
      {/* Decorative bubbles */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#b38e5d]/10 to-[#b38e5d]/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-[#b38e5d]/8 to-[#b38e5d]/15 rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-700" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-[#b38e5d] to-[#8b6d47] rounded-full" />
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-[#b38e5d] bg-clip-text text-transparent">
            Payment Summary
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white/60 rounded-xl px-5 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <IndianRupee className="w-5 h-5 text-[#8b6d47]" />
              <span className="text-slate-600 font-medium">Monthly Rent</span>
            </div>
            <span className="font-semibold text-slate-800">₹{monthlyRent}</span>
          </div>

          <div className="flex items-center justify-between bg-white/60 rounded-xl px-5 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#8b6d47]" />
              <span className="text-slate-600 font-medium">Duration</span>
            </div>
            <span className="font-semibold text-slate-800">{duration}</span>
          </div>

          {addOnservice.length > 0 && (
            <div className="flex items-center justify-between bg-white/60 rounded-xl px-5 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <PackageOpen className="w-5 h-5 text-[#8b6d47]" />
                <span className="text-slate-600 font-medium">Add-On Services</span>
              </div>
              <span className="font-semibold text-slate-800">₹{addOnCost}</span>
            </div>
          )}

          {/* New Payment Method */}
          <div className="flex items-center justify-between bg-white/60 rounded-xl px-5 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-[#8b6d47]" />
              <span className="text-slate-600 font-medium">Payment Method</span>
            </div>
            <span className="font-semibold text-slate-800 capitalize">{paymentMethod}</span>
          </div>

          {/* New Payment Status */}
          <div className="flex items-center justify-between bg-white/60 rounded-xl px-5 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <CircleCheck className="w-5 h-5 text-[#8b6d47]" />
              <span className="text-slate-600 font-medium">Payment Status</span>
            </div>
            <span
              className={`font-semibold ${
                paymentStatus.toLowerCase() === "completed"
                  ? "text-green-600"
                  : paymentStatus.toLowerCase() === "pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
            </span>
          </div>
        </div>

        <div className="border-t pt-5 mt-4 flex justify-between items-center font-bold text-lg text-slate-800">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#b38e5d]" />
            <span>Total Payable</span>
          </div>
          <span className="text-[#b38e5d] text-xl">₹{totalAmount}</span>
        </div>
      </div>
    </Card>
  );
};

export default BookingPaymentSummary;
