import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../../components/ui/button";
import UserLayout from "../../components/user/UserLayout";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { IBookingList, IBookingResponse } from "../../types/booking";
import { notifyError } from "../../utils/notifications";

const Bookings = () => {
  const { userBookings } = useAuthStore();
  const [bookings, setBookings] = useState<IBookingList[]>([]);
const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
 useEffect(() => {
  const fetchBookings = async () => {
    try {
      setLoading(true); 
      const response: IBookingResponse = await userBookings(currentPage);
      setBookings(response.bookings);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false); 
    }
  };

  fetchBookings();
}, [currentPage]);


  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
 if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-t-2 border-golden rounded-full"></div>
      </div>
    );
  }
  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Link
                to="/"
                className="inline-flex items-center text-gray-600 hover:text-[#b38e5d] mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-sm text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                No Bookings Yet
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't made any property bookings yet.
              </p>
              <Link
                to="/user/properties"
                className="bg-[#b38e5d] text-white px-6 py-2 rounded-md hover:bg-[#8b6b3b] transition-colors"
              >
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/4">
                      <img
                        src={booking.propertyId?.images[0]}
                        alt={booking.propertyId?.title}
                        className="w-full h-40 md:h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex flex-wrap justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">
                            {booking.propertyId?.title}
                          </h2>
                          <div className="flex items-center text-gray-600 text-sm mt-1">
                            <MapPin className="h-4 w-4 mr-1 text-[#b38e5d]" />
                            {booking.propertyId?.city} ,
                            {booking.propertyId?.district},
                            {booking.propertyId?.state}
                          </div>
                        </div>
            <div
  className={`px-4 py-1 rounded-full text-sm font-medium capitalize inline-block shadow-sm ${
    booking.bookingStatus === "confirmed" || booking.bookingStatus === "completed"
      ? "bg-green-500/10 text-green-700 border border-green-500"
      : booking.bookingStatus === "cancelled"
      ? "bg-red-500/10 text-red-700 border border-red-500"
      : "bg-yellow-500/10 text-yellow-700 border border-yellow-500"
  }`}
>
  {booking.bookingStatus}
</div>


                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-[#b38e5d]" />
                          <div>
                            <p className="text-xs text-gray-500">
                              Move-in Date
                            </p>
                            <p className="font-medium">
                              {format(booking.moveInDate, "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-[#b38e5d]" />
                          <div>
                            <p className="text-xs text-gray-500">End Date</p>
                            <p className="font-medium">
                              {format(booking.endDate, "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-[#b38e5d]" />
                          <div>
                            <p className="text-xs text-gray-500">Duration</p>
                            <p className="font-medium">
                              {booking.rentalPeriod} months
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 mt-4 border-t">
                        <div>
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-lg font-bold text-[#b38e5d]">
                            ₹{booking?.totalCost.toLocaleString()}
                          </p>
                        </div>
                        <div className="space-x-3">
                          <Button
                            variant="outline"
                            className="border-[#b38e5d] text-[#b38e5d] hover:bg-[#f8f5f0]"
                            onClick={() => {
                              const propertyId = booking?.propertyId?._id;
                              const ownerId = booking?.ownerId;

                              if (propertyId && ownerId) {
                                navigate(`/user/chat/${propertyId}/${ownerId}`);
                              } else {
                                console.error("Missing propertyId or ownerId");
                                notifyError(
                                  "Unable to connect owner right now..."
                                );
                              }
                            }}
                          >
                            Contact Support
                          </Button>

                          <button
                            onClick={() =>
                              navigate(`/user/bookings/${booking._id}`)
                            }
                            className="bg-[#b38e5d] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#a77f4f] hover:shadow-lg transition-all duration-300 text-sm font-semibold"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </UserLayout>
  );
};

export default Bookings;
