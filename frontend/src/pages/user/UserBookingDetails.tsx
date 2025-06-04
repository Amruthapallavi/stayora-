import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { MessageSquare, X, Star } from "lucide-react";
import BookingHeader from "../../components/booking/BookingHeader";
import BookingPropertyDetails from "../../components/booking/BookingPropertyDetails";
import BookingOwnerCard from "../../components/booking/BookingOwnerCard";
import BookingPaymentSummary from "../../components/booking/BookingPaymentSummary";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { IOwner } from "../../types/owner";
import Swal from "sweetalert2";
import Footer from "../../components/user/Footer";

const UserBookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { bookingDetails, cancelBooking, submitReview } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [ownerData, setOwnerData] = useState<IOwner | null | undefined>(null);
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);

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
          setOwnerData(bookingData.ownerData);
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

    if (confirm.isConfirmed) {
      try {
        const response = await cancelBooking(id || "", cancelReason);
        notifySuccess(response?.message);
        navigate("/user/bookings");
      } catch (err) {
        console.error("Cancel Booking Error:", err);
        notifyError(
          (err as any)?.response?.data?.message || "Failed to cancel booking"
        );
      }
    }
  };

  const addReview = async () => {
    if (reviewRating === 0) {
      return notifyError("Please provide a rating.");
    }
    if (!reviewText.trim()) {
      return notifyError("Please write a review.");
    }

    try {
      setSubmittingReview(true);
      console.log(booking._id, reviewRating, reviewText);
      const response = await submitReview(
        booking._id,
        reviewRating,
        reviewText
      );
      //   if (!response.ok) {
      //   throw new Error("Failed to submit review");
      // }

      notifySuccess("Review submitted successfully!");
      setReviewText("");
      setReviewRating(0);
    } catch (error) {
      const e = error as any;
      const message =
        e?.response?.data?.message || e?.message || "Failed to submit review.";
      notifyError(message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const today = new Date();
  const moveInDate = new Date(booking?.moveInDate);
  const fiveDaysBeforeMoveIn = new Date(moveInDate);
  fiveDaysBeforeMoveIn.setDate(fiveDaysBeforeMoveIn.getDate() - 5);

  const isCancelable = today <= fiveDaysBeforeMoveIn;

  const handleChatWithOwner = () => {
    navigate(`/user/chat/${booking.propertyId?._id}/${ownerData?.id}`);
  };

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
              mapLocation={booking.propertyId.mapLocation}
            />

            <div className="mt-6">
              <Card className="relative p-8 bg-gradient-to-br from-white via-[#b38e5d]/5 to-[#b38e5d]/10 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#b38e5d]/20 to-[#b38e5d]/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#b38e5d]/15 to-[#b38e5d]/25 rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-700" />

                <h1 className="text-xl font-semibold mb-4 border-b pb-2">
                  Add-on Services
                </h1>

                {booking.addOn && booking.addOn.length > 0 ? (
                  <ul className="space-y-3">
                    {booking.addOn.map((service: any, index: any) => (
                      <li
                        key={service.serviceId || index}
                        className="flex items-center justify-between border p-3 rounded-md bg-gray-50"
                      >
                        <div className="text-sm font-medium text-gray-800">
                          {service.serviceName}
                        </div>
                        <div className="text-sm text-gray-600">
                          ₹{service.serviceCost}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    No add-on services added.
                  </p>
                )}
              </Card>
            </div>

            {/* Review section only if booking is completed */}
            {booking.bookingStatus === "completed" && (
              <div className="mt-8">
                <Card className="p-6 rounded-2xl bg-white shadow-lg space-y-4">
                  <h2 className="text-2xl font-semibold mb-4">
                    Submit Your Review
                  </h2>
                  <div className="flex items-center space-x-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={28}
                        className={`cursor-pointer transition-colors duration-200 ${
                          reviewRating >= star
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => setReviewRating(star)}
                      />
                    ))}
                  </div>
                  <textarea
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#b38e5d]"
                    placeholder="Write your review here..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                  <Button
                    onClick={addReview}
                    disabled={submittingReview}
                    className="bg-[#b38e5d] hover:bg-[#a1773d] text-white w-full rounded-xl"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                </Card>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {ownerData && (
              <BookingOwnerCard
                owner={{
                  name: ownerData.name,
                  phone: ownerData.phone,
                  email: ownerData.email,
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

            <Card className="p-6 rounded-2xl bg-gradient-to-br from-white via-[#fdf8f2] to-[#f1e9e0] shadow-lg space-y-4">
              {booking.bookingStatus === "confirmed" && isCancelable ? (
                <>
                  {!showCancelReason ? (
                    <Button
                      className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-xl shadow-md transition-all duration-300"
                      onClick={() => setShowCancelReason(true)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel Booking
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        className="w-full border border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-xl p-3 text-sm resize-none shadow-sm transition-all"
                        rows={3}
                        placeholder="Enter cancellation reason"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                      ></textarea>
                      <Button
                        className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-xl shadow-md transition-all duration-300"
                        onClick={handleCancelBooking}
                      >
                        Confirm Cancel
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <Button
                  onClick={handleChatWithOwner}
                  className="w-full border border-gray-300 hover:border-[#b38e5d] hover:bg-[#f3eee7] text-gray-700 hover:text-[#b38e5d] font-medium rounded-xl shadow-sm transition-all duration-300"
                  variant="outline"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Owner
                </Button>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBookingDetails;
