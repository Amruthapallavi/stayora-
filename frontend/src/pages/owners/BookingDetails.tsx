import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import BookingHeader from "../../components/booking/BookingHeader";
import BookingPropertyDetails from "../../components/booking/BookingPropertyDetails";
import BookingOwnerCard from "../../components/booking/BookingOwnerCard";
import BookingPaymentSummary from "../../components/booking/BookingPaymentSummary";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import Swal from "sweetalert2";
import { IUser } from "../../types/user";

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { bookingDetails, cancelBooking } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [userData, setUserData] = useState<IUser | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (!id) {
      notifyError("Booking ID is missing");
      navigate("/owner/bookings");
      return;
    }

    const fetchBooking = async () => {
      try {
        setLoading(true);
        const bookingData = await bookingDetails(id);
        if (bookingData) {
          setBooking(bookingData.bookingData);
          setUserData(bookingData.userData);
        } else {
          notifyError("Booking not found");
          navigate("/owner/bookings");
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        notifyError("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, navigate, bookingDetails]);
  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      return notifyError("Please provide a reason for cancellation.");
    }
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });
    setCancelReason(cancelReason);
    setProcessing(true);
    if (confirm.isConfirmed) {
      try {
        if (id) {
          const response = await cancelBooking(id, cancelReason);
          notifySuccess(response?.message);
          navigate("/user/bookings");
        } else {
          Swal.fire("Error!", "Booking ID is missing.", "error");
        }
      } catch (err) {
        console.error("Cancel Booking Error:", err);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  // const handleContactHost = () => {
  //   notifySuccess('Message sent to host');
  // };
  const handleConfirmBooking = () => {};
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-t-2 border-golden rounded-full"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            Booking Not Found
          </h2>
          <p className="text-gray-500 mt-2">
            The booking you're looking for doesn't exist.
          </p>
          <Link to="/bookings">
            <Button className="mt-4">View All Bookings</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <BookingHeader
        propertyName={booking.propertyName}
        address={booking.propertyId?.address}
        status={booking.bookingStatus}
        bookingId={booking.bookingId}
      />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BookingPropertyDetails
              moveInDate={booking.moveInDate}
              duration={`${booking.rentalPeriod} months`}
              propertyType={booking.propertyId?.type}
              monthlyRent={booking.rentPerMonth}
              amenities={booking.propertyId?.features}
              mapLocation={booking.propertyId?.mapLocation}
            />
          </div>

          <div className="space-y-6">
            {userData && (
              <BookingOwnerCard
                owner={{
                  id: userData.id,
                  name: userData.name,
                  phone: userData.phone,
                  email: userData.email,
                  propertyId: booking?.productId?._id,
                }}
              />
            )}
            <BookingPaymentSummary
              monthlyRent={booking.rentPerMonth}
              duration={`${booking.rentalPeriod} months`}
              addOnservice={booking.addOn}
              addOnCost={booking.addOnCost}
              totalAmount={booking.totalCost}
              paymentMethod={booking.paymentMethod}
              paymentStatus={booking.paymentStatus}
            />
            {booking.bookingStatus === "pending" && (
              <Card className="p-4">
                <div className="space-y-3">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleConfirmBooking}
                    disabled={processing}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm Booking
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-600 hover:bg-red-50"
                    onClick={handleCancelBooking}
                    disabled={processing}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Booking
                  </Button>
                </div>
              </Card>
            )}
            <Button
              variant="outline"
              className="w-full text-blue-600 border-blue-600 hover:bg-red-50"
              onClick={() => navigate("/owner/chat")}
              // disabled={processing}
            >
              Contact Guest
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
