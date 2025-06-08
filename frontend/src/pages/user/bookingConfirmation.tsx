import { Link } from "react-router-dom";
import { format } from "date-fns";
import { IBooking } from "../../types/booking";

interface Props {
  bookingData: IBooking | null;
  moveInDate: Date | null;
  endDate: Date | null;
}

export default function BookingConfirmationPage({
  bookingData,
  moveInDate,
  endDate,
}: Props) {
  // Helper to color payment status
  const paymentStatusColor = (status?: string) => {
    if (!status) return "text-gray-700";
    const lower = status.toLowerCase();
    if (lower === "completed") return "text-green-600 font-semibold";
    if (lower === "pending") return "text-yellow-600 font-semibold";
    if (lower === "failed") return "text-red-600 font-semibold";
    return "text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 text-lg">
            Your reservation has been completed successfully.
          </p>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 mb-8 shadow-inner">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
            Booking Summary
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Booking Reference:</span>
              <span className="font-medium text-gray-900">
                {bookingData?.bookingId ?? "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Property Name:</span>
              <span className="font-medium text-gray-900">
                {bookingData?.propertyName ?? "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Move-in Date:</span>
              <span className="font-medium text-gray-900">
                {moveInDate ? format(moveInDate, "MMM d, yyyy") : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>End Date:</span>
              <span className="font-medium text-gray-900">
                {endDate ? format(endDate, "MMM d, yyyy") : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-semibold text-[#b38e5d]">
                ₹{bookingData?.totalCost?.toLocaleString("en-IN") ?? "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="font-medium text-gray-900">
                {bookingData?.paymentMethod ?? "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span className={paymentStatusColor(bookingData?.paymentStatus)}>
                {bookingData?.paymentStatus ?? "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <Link
            to="/user/bookings"
            className="px-6 py-2 border border-[#b38e5d] rounded-md text-[#b38e5d] hover:bg-[#f8f5f0] transition"
          >
            View Booking
          </Link>
          <Link
            to="/user/home"
            className="bg-[#b38e5d] text-white px-6 py-2 rounded-md hover:bg-[#8b6b3b] transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
