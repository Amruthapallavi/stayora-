import  { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Home, User, CreditCard, Clock, Check, X } from 'lucide-react';
// import { bookings, properties, users } from '../../utils/mockData';
import { Button } from '../../components/ui/button';
import StatusBadge from '../../components/ui/StatusBadge';
import { Card, CardContent } from '../../components/ui/card';
import { Separator } from '../../components/ui/seperator';
import { useAuthStore } from '../../stores/authStore';
import { notifyError } from '../../utils/notifications';
import { IOwner } from '../../types/owner';
import { IUser } from '../../types/user';
import AdminLayout from '../../components/admin/AdminLayout';
import OwnerDetailsModal from '../../components/admin/OwnerDetailsModal';

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {bookingDetails} =useAuthStore();
    const [ownerData, setOwnerData] = useState<IOwner | null>(null);
    const [userData, setUserData] = useState<IUser | null>(null);
 const [selectedUser, setSelectedUser] = useState<IUser | IOwner | null>(null);
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState<any>(null);
  const navigate = useNavigate();
  
   useEffect(() => {
      if (!id) {
        notifyError("Booking ID is missing");
        navigate('/admin/bookings');
        return;
      }
  
      const fetchBooking = async () => {
        try {
          setLoading(true);
          const bookingData = await bookingDetails(id);
          console.log(bookingData,"hiyt")
          if (bookingData) {
            setBooking(bookingData.bookingData);
            setUserData(bookingData.userData);
            if (bookingData.ownerData) {
  setOwnerData(bookingData.ownerData); 
} else {
  setOwnerData(null);
}
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
   const handleViewDetails = (user: IUser |IOwner) => {
    setSelectedUser(user);
    setIsModal(true);
  };
  if (!booking) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Booking Not Found</h2>
        <p className="text-gray-500 mb-4">The booking you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/admin/bookings')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookings
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-t-2 border-black rounded-full"></div>
        </div>
      </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/admin/bookings')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Booking #{booking.bookingId}</h1>
          <StatusBadge status={booking.bookingStatus} />
        </div>
        <div className="text-sm text-gray-500">
        <div>Created on {new Date(booking.createdAt).toLocaleDateString('en-US', {
  year: 'numeric', // '2025'
  month: 'long',   // 'April'
  day: 'numeric',  // '15'
})}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 flex-shrink-0">
                    <Home className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{booking.propertyName}</p>
                    <p className="text-sm text-gray-500">Property</p>
                    {booking && (
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-blue-500"
                        onClick={() => navigate(`/admin/properties/${booking.propertyId._id}`)}
                      >
                        View Property
                      </Button>
                    )}
                  </div>
                </div>
                
                <Separator />
                <div className="flex items-start">
                  <div className="w-10 flex-shrink-0">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{ownerData?.name}</p>
                    <p className="text-sm text-gray-500">Owner</p>
                    {ownerData && (
                       <button
                        className="p-0 h-auto text-blue-500"
                                  onClick={() => handleViewDetails(ownerData)}
                                >
                                   View owner profile
                                </button>
                      // <Button 
                      //   variant="link" 
                      //   className="p-0 h-auto text-blue-500"
                      //   onClick={() => navigate(`/admin/owners/${ownerData?.id}`)}
                      // >
                      //   View owner Profile
                      // </Button>
                    )}
                  </div>
                </div>
                
                <Separator />
                <div className="flex items-start">
                  <div className="w-10 flex-shrink-0">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{userData?.name}</p>
                    <p className="text-sm text-gray-500">Guest</p>
                    {userData && (
                    <button className="p-0 h-auto text-blue-500"
                                  onClick={() => handleViewDetails(userData)}
                                >
                                   View Guest profile
                                </button>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start">
                  <div className="w-10 flex-shrink-0">
                    <Calendar className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                  <div className="flex items-center space-x-2">
  <p className="font-medium">{new Date(booking.moveInDate).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric'
  })}</p>
  <span>→</span>
  <p className="font-medium">{new Date(booking.endDate).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric'
  })}</p>
</div>

                    <p className="text-sm text-gray-500">move-in / end-Date</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start">
                  <div className="w-10 flex-shrink-0">
                    <CreditCard className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">₹{booking.totalCost}</p>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-500 mr-2">Payment Method: {booking.paymentMethod}</p>
                      <StatusBadge status={booking.paymentStatus} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Booking Timeline</h2>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4 relative">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center z-10 relative">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="absolute top-8 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gray-200"></div>
                  </div>
                  <div>
                    <p className="font-medium">Booking Created</p>
                    <p className="text-sm text-gray-500">{booking.createdAt}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Booking was created by {booking.userName}
                    </p>
                  </div>
                </div>
                
                {booking.status !== 'pending' && (
                  <div className="flex">
                    <div className="mr-4 relative">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center z-10 relative">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="absolute top-8 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gray-200"></div>
                    </div>
                    <div>
                      <p className="font-medium">Booking Confirmed</p>
                      <p className="text-sm text-gray-500">{booking.createdAt}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Booking was confirmed automatically by the system
                      </p>
                    </div>
                  </div>
                )}
                
                {booking.status === 'cancelled' && (
                  <div className="flex">
                    <div className="mr-4">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <X className="h-4 w-4 text-red-600" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Booking Cancelled</p>
                      <p className="text-sm text-gray-500">2023-02-25</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Booking was cancelled by {booking.userName}
                      </p>
                    </div>
                  </div>
                )}
                
                {booking.status === 'completed' && (
                  <div className="flex">
                    <div className="mr-4">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Check className="h-4 w-4 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Booking Completed</p>
                      <p className="text-sm text-gray-500">2023-04-09</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Guest checked out successfully
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
         <OwnerDetailsModal
            owner={selectedUser}
            isOpen={isModal}
            onClose={() => setIsModal(false)}
          />
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rent-per-month</span>
                  <span>₹{booking.rentPerMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span>₹{booking.addOnCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span>₹{booking.totalCost}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{booking.totalCost}</span>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm text-gray-500 flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Payment method: {booking.paymentMethod}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {booking.status === 'pending' && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Booking Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Confirm Booking
                  </Button>
                  <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-50">
                    Cancel Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {booking.status === 'confirmed' && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Booking Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full">
                    Send Message to Guest
                  </Button>
                  <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-50">
                    Cancel Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default BookingDetail;
