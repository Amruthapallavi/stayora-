import { Card } from "../../components/ui/card";

interface BookingPaymentSummaryProps {
  monthlyRent: number;
  duration: string;
  totalAmount: number;
  addOnservice:string[];
  addOnCost:number;

}

const BookingPaymentSummary = ({
  monthlyRent,
  duration,
  totalAmount,
  addOnservice,
  addOnCost
}: BookingPaymentSummaryProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Monthly Rent</span>
          <span className="font-medium">₹{monthlyRent}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Duration</span>
          <span className="font-medium">{duration}</span>
        </div>
        {/* <div className="flex justify-between">
          <span className="text-gray-600">Security Deposit</span>
          <span className="font-medium">₹{monthlyRent}</span>
        </div> */}
        <div className="flex justify-between">
          <span className="text-gray-600">add-On service</span>
          <span className="font-medium">₹{addOnCost}</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between font-semibold">
            <span>Total Amount</span>
            <span className="text-golden">₹{totalAmount}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookingPaymentSummary;
