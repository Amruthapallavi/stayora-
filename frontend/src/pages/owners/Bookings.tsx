import { useState, useEffect } from "react";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import {
  Clock,
  User,
  Home,
  CheckCircle,
  XCircle,
  AlertCircle,
  IndianRupee,
} from "lucide-react";
import { format } from "date-fns";
import OwnerLayout from "../../components/owner/OwnerLayout";
import { useAuthStore } from "../../stores/authStore";
import { IBooking } from "../../types/booking";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Pagination from "../../components/user/UserPagination";

const OwnerBookings = () => {
  const { ownerPropertyBookings, user } = useAuthStore();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const result = await ownerPropertyBookings(user.id, currentPage, limit);

        setBookings(result.bookings);
        setTotalPages(result.totalPages ?? 1);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchBookings();
    }
  }, [user?.id, currentPage]);

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    if (filter === "confirmed") return booking.bookingStatus === "confirmed";
    if (filter === "pending") return booking.bookingStatus === "pending";
    if (filter === "cancelled") return booking.bookingStatus === "cancelled";
    return true;
  });

  const handleConfirm = async (bookingId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to confirm this booking.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm it!",
    });
   if(!bookingId){
    console.error("booking Id not found");
   }
    if (result.isConfirmed) {
      try {
        Swal.fire("Confirmed!", "Booking has been confirmed.", "success");
      } catch (error) {
        Swal.fire("Error", "Something went wrong.", "error");
      }
    }
  };

  const handleCancel = async (bookingId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this booking.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
    });
 if(!bookingId){
    console.error("booking Id not found");
   }
    if (result.isConfirmed) {
      try {
        Swal.fire("Cancelled!", "Booking has been cancelled.", "success");
      } catch (error) {
        Swal.fire("Error", "Something went wrong.", "error");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            {status}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
            {status}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            {status}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            {status}
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            {status}
          </Badge>
        );
      case "Refunded":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            {status}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <OwnerLayout>
      <div className="flex min-h-screen bg-[#f3f4f6]">
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-[#bfa760] mb-6">Bookings</h1>

            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              {["all", "confirmed", "pending", "cancelled"].map((status) => (
                <button
                  key={status}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === status
                      ? "bg-[#bfa760] text-white"
                      : "bg-white text-[#374151] hover:bg-[#f9fafb]"
                  }`}
                  onClick={() => {
                    setFilter(status);
                    setCurrentPage(1);
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-10 w-10 border-t-2 border-[#bfa760] rounded-full"></div>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <AlertCircle className="h-12 w-12 text-[#9ca3af] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#111827]">
                  No bookings found
                </h3>
                <p className="mt-1 text-[#6b7280]">
                  There are no bookings matching your filter criteria.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking._id} className="p-4 bg-white">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-start">
                            <div className="w-24 h-24 bg-[#fdf6e3] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                              <img
                                className="h-20 w-20 object-cover rounded-md"
                                src={booking.propertyImages[0]}
                                alt="Property"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#111827]">
                                {booking.propertyName}
                              </h3>
                              <div className="flex items-center text-[#6b7280] text-sm mt-1">
                                <User className="h-4 w-4 mr-1" />
                                <span>
                                  {typeof booking.userId === "object" &&
                                  "name" in booking.userId
                                    ? booking.userId.name
                                    : "Unknown User"}
                                </span>
                                <span className="mx-2">•</span>
                                <span>
                                  {typeof booking.userId === "object" &&
                                  "email" in booking.userId
                                    ? booking.userId.email
                                    : "Unknown Email"}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                                <div className="flex items-center text-sm text-[#4b5563]">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>
                                    {format(booking.moveInDate, "MMM d, yyyy")}{" "}
                                    - {format(booking.endDate, "MMM d, yyyy")}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-[#4b5563]">
                                  <Home className="h-4 w-4 mr-1" />
                                  <span>ID: {booking.bookingId}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center mb-2">
                            <IndianRupee className="h-5 w-5 text-[#059669] mr-1" />
                            <span className="font-bold text-[#111827]">
                              {booking.totalCost}
                            </span>
                          </div>
                          <div className="flex space-x-2 mb-2">
                            {getStatusBadge(booking.bookingStatus)}
                            {getPaymentBadge(booking.paymentStatus)}
                          </div>
                          <div className="text-xs text-[#6b7280]">
                            Booked on {format(booking.createdAt, "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                      <div className="border-t mt-4 pt-4 flex justify-end space-x-3">
                        <button
                          onClick={() =>
                            navigate(`/owner/bookings/${booking._id}`)
                          }
                          className="text-[#4b5563] hover:text-[#111827] text-sm font-medium"
                        >
                          View Details
                        </button>
                        {booking.bookingStatus === "pending" && (
                          <>
                            <button
                              onClick={() => handleConfirm(booking._id)}
                              className="text-[#059669] hover:text-[#047857] text-sm font-medium flex items-center"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" /> Confirm
                            </button>
                            <button
                              onClick={() => handleCancel(booking._id)}
                              className="text-[#dc2626] hover:text-[#b91c1c] text-sm font-medium flex items-center"
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default OwnerBookings;
