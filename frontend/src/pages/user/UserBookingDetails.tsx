import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { MessageSquare, X } from 'lucide-react';
import BookingHeader from '../../components/booking/BookingHeader';
import BookingPropertyDetails from '../../components/booking/BookingPropertyDetails';
import BookingOwnerCard from '../../components/booking/BookingOwnerCard';
import BookingPaymentSummary from '../../components/booking/BookingPaymentSummary';
import { notifyError, notifySuccess } from '../../utils/notifications';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { IOwner } from '../../types/IOwner';
import Swal from "sweetalert2";
import ChatBox from '../../components/chat/chatBox';

// import Map from '../../components/Map';
// import type { ExtendedBookingDetails } from '../../types/booking';

const UserBookingDetails = () => {

 
  const { id } = useParams<{ id: string }>();
  const {bookingDetails, cancelBooking}=useAuthStore();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [ownerData, setOwnerData] = useState<IOwner | null>(null);
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [messages, setMessages] = useState([]);
    const navigate=useNavigate();
 useEffect(() => {
    if (!id) {
      notifyError("Booking ID is missing");
      navigate('/owner/bookings');
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
          navigate('/owner/bookings');
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

       const response = await cancelBooking(id ||"",cancelReason);
      notifySuccess(response?.message);
      navigate("/user/bookings")
    } catch (err) {
      console.error("Cancel Booking Error:", err);
      notifyError(err?.response?.data.message)
    }
  }
};
const today = new Date();
const moveInDate = new Date(booking?.moveInDate);
const fiveDaysBeforeMoveIn = new Date(moveInDate);
fiveDaysBeforeMoveIn.setDate(fiveDaysBeforeMoveIn.getDate() - 5);

const isCancelable = today <= fiveDaysBeforeMoveIn;

// const handleSendMessage = (message: string) => {
//   const newMessage = {
//     id: Date.now().toString(),
//     sender: 'user',
//     message,
//     timestamp: new Date(),
//   };
//   // setMessages([...messages, newMessage]);
//   notifySuccess('Message sent successfully');
// };
  // const handleContactHost = () => {
  //   notifySuccess('Message sent to host');
  // };

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
          <h2 className="text-2xl font-semibold text-gray-700">Booking Not Found</h2>
          <p className="text-gray-500 mt-2">The booking you're looking for doesn't exist.</p>
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
    location={booking.location}
  />

  {/* <div className="mt-6">
    <ChatBox
      messages={messages}
      onSendMessage={handleSendMessage}
    />
  </div> */}
</div>

       
          <div className="space-y-6">
            <BookingOwnerCard owner={ownerData} />
            <BookingPaymentSummary
              monthlyRent={booking.rentPerMonth}
              duration={`${booking.rentalPeriod} months`}
              addOnservice={booking.addOn}
              addOnCost={booking.addOnCost}
              totalAmount={booking.totalCost}
            />
      <Card className="p-4">
      {booking.bookingStatus === "confirmed" && isCancelable ? (
        <>
          {!showCancelReason ? (
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              onClick={() => setShowCancelReason(true)}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel Booking
            </Button>
          ) : (
            <div className="space-y-3">
              <textarea
                className="w-full border rounded-lg p-2 text-sm"
                rows={3}
                placeholder="Enter cancellation reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              ></textarea>
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={handleCancelBooking}
              >
                Confirm Cancel
              </Button>
            </div>
          )}
        </>
      ) : (
        <Button className="w-full" variant="outline">
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
