import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FilterX, Filter } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";
import {
  IBookingAdminResponse,
  ISimpleBooking,
} from "../../types/booking";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useAuthStore } from "../../stores/authStore";
import AdminLayout from "../../components/admin/AdminLayout";

const AdminBookings = () => {
  const navigate = useNavigate();
  const { listAllBookings } = useAuthStore();
  const [bookings, setBookings] = useState<ISimpleBooking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [_filteredBookings, setFilteredBookings] = useState<ISimpleBooking[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 2;

  const applyFilters = (query: string, status: string | null) => {
    let filtered = bookings;

    if (query.trim() !== "") {
      filtered = filtered.filter(
        (booking) =>
          booking.propertyName.toLowerCase().includes(query.toLowerCase()) ||
          booking.userName?.toLowerCase().includes(query.toLowerCase()) ||
          booking._id.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter((booking) => booking.bookingStatus === status);
    }

    setFilteredBookings(filtered);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response: IBookingAdminResponse = await listAllBookings();
        setBookings(response.bookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    fetchBookings();
  }, []);
  useEffect(() => {
    setFilteredBookings(bookings);
  }, [bookings]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    applyFilters(query, statusFilter);
  };

  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status);
    applyFilters(searchQuery, status);
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const totalPages = Math.ceil(bookings.length / bookingsPerPage);
  // const goToNextPage = () => {
  //   if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  // };

  // const goToPrevPage = () => {
  //   if (currentPage > 1) setCurrentPage(prev => prev - 1);
  // };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter(null);
    setFilteredBookings(bookings);
  };

  const columns = [
    {
      header: "Booking ID",
      accessor: "bookingId" as keyof ISimpleBooking, // Use ISimpleBooking here
    },
    {
      header: "Property",
      accessor: "propertyName" as keyof ISimpleBooking,
    },
    {
      header: "Guest",
      accessor: "userName" as keyof ISimpleBooking,
    },
    {
      header: "Move-in-date",
      accessor: (booking: ISimpleBooking) =>
        new Date(booking.moveInDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      header: "End-date",
      accessor: (booking: ISimpleBooking) =>
        new Date(booking.endDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      header: "Status",
      accessor: (booking: ISimpleBooking) => (
        <StatusBadge status={booking.bookingStatus} />
      ),
    },
    {
      header: "Payment",
      accessor: (booking: ISimpleBooking) => (
        <StatusBadge status={booking.paymentStatus} />
      ),
    },
    {
      header: "Total",
      accessor: (booking: ISimpleBooking) =>
        `₹${booking.totalCost.toLocaleString()}`,
    },
    {
      header: "Actions",
      accessor: (booking: ISimpleBooking) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/bookings/${booking._id}`);
          }}
        >
          View
        </Button>
      ),
      className: "text-right",
    },
  ];

  function handleRowClick(booking: ISimpleBooking) {
    navigate(`/admin/bookings/${booking._id}`);
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Booking Management
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search bookings..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  {statusFilter ? `Status: ${statusFilter}` : "Filter Status"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusFilter("pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusFilter("confirmed")}
                >
                  Confirmed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusFilter("cancelled")}
                >
                  Cancelled
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusFilter("completed")}
                >
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilter(null)}>
                  All Statuses
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {(searchQuery || statusFilter) && (
              <Button variant="ghost" onClick={handleClearFilters}>
                <FilterX className="mr-2 h-4 w-4" /> Clear
              </Button>
            )}
          </div>
        </div>

        <DataTable<ISimpleBooking>
          data={currentBookings} // currentBookings should be ISimpleBooking[]
          columns={columns}
          onRowClick={handleRowClick}
          emptyMessage="No bookings found matching your search."
        />
      </div>
      <div>
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-2">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
