import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FilterX, Filter } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { IBooking } from '../../types/IBooking';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../components/ui/dropdown-menu';
import { useAuthStore } from '../../stores/authStore';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminBookings = () => {
  const navigate = useNavigate();
  const {listAllBookings}= useAuthStore();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [filteredBookings, setFilteredBookings] = useState<IBooking[]>(bookings);
  
  const applyFilters = (query: string, status: string | null) => {
    let filtered = bookings;
    
    if (query.trim() !== '') {
      filtered = filtered.filter(booking => 
        booking.propertyName.toLowerCase().includes(query.toLowerCase()) || 
        booking.userName?.toLowerCase().includes(query.toLowerCase()) ||
        booking._id.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (status) {
      filtered = filtered.filter(booking => booking.bookingStatus === status);
    }
    
    setFilteredBookings(filtered);
  };

useEffect(() => {
  const fetchBookings = async () => {
    try {
    const response=  await listAllBookings();
    setBookings(response.bookings);
    console.log(response,"fromdsdd")
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
  
  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter(null);
    setFilteredBookings(bookings);
  };
  
  // Fix TypeScript errors by ensuring accessor is either a key of Booking or a function
  const columns = [
    { 
      header: 'Booking ID', 
      accessor: 'bookingId' as keyof IBooking,
    },
    { 
      header: 'Property', 
      accessor: 'propertyName' as keyof IBooking,
    },
    { 
      header: 'Guest', 
      accessor: 'userName' as keyof IBooking,
    },
    {
        header: 'Move-in-date',
        accessor: (booking: IBooking) =>
          new Date(booking.moveInDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
      },
      {
        header: 'End-date',
        accessor: (booking: IBooking) =>
          new Date(booking.endDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
      },
      
    { 
      header: 'Status', 
      accessor: (booking: IBooking) => <StatusBadge status={booking.bookingStatus} />
    },
    { 
      header: 'Payment', 
      accessor: (booking: IBooking) => <StatusBadge status={booking.paymentStatus} />
    },
    { 
      header: 'Total', 
      accessor: (booking: IBooking) => `₹${booking.totalCost.toLocaleString()}`
    },
    { 
      header: 'Actions', 
      accessor: (booking: IBooking) => (
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
      className: "text-right"
    },
  ];

  const handleRowClick = (booking: IBooking) => {
    navigate(`/admin/bookings/${booking._id}`);
  };

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Booking Management</h1>
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
              <DropdownMenuItem onClick={() => handleStatusFilter('pending')}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter('confirmed')}>Confirmed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter('cancelled')}>Cancelled</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter('completed')}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter(null)}>All Statuses</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {(searchQuery || statusFilter) && (
            <Button variant="ghost" onClick={handleClearFilters}>
              <FilterX className="mr-2 h-4 w-4" /> Clear
            </Button>
          )}
        </div>
      </div>
      
      <DataTable 
        data={filteredBookings} 
        columns={columns} 
        onRowClick={handleRowClick}
        emptyMessage="No bookings found matching your search."
      />
    </div>
    </AdminLayout>
  );
};

export default AdminBookings;
