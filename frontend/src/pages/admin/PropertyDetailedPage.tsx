import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Home, User, Calendar, IndianRupee } from 'lucide-react';
import { Button } from '../../components/ui/button';
import StatusBadge from '../../components/ui/StatusBadge';
import { Card, CardContent } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/seperator';
import { useAuthStore } from '../../stores/authStore';
import  { IProperty } from '../../types/property';
import { IOwner } from '../../types/owner';
import { notifyError, notifySuccess } from '../../utils/notifications';
import AdminLayout from '../../components/admin/AdminLayout';
import Swal from 'sweetalert2';
import OwnerDetailsModal from '../../components/admin/OwnerDetailsModal';
import PropertyMap from '../../components/user/PropertyMap';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
    const { getPropertyById ,rejectProperty,approveProperty} = useAuthStore();
    const [property, setProperty] = useState<IProperty | null>(null);
    const [bookingData, setBookingData] = useState<any | null>(null);
const [selectedUser, setSelectedUser] = useState<IOwner | null>(null);
  const [isModal, setIsModal] = useState(false);
    const [ownerData, setOwnerData] = useState<IOwner |null >(null);
    const [loading, setLoading] = useState(true);

      useEffect(() => {
        loadPropertyAndFeatures();
      }, [id]);
  
        const loadPropertyAndFeatures = async () => {
          try {
            setLoading(true);
            
            // Load property details
            const propertyResponse = await getPropertyById(id || '');
            console.log(propertyResponse,"property")
            if (!propertyResponse.Property) {
              notifyError('Property not found');
              return;
            }
          //   setProperty(propertyResponse.property);
          setProperty(propertyResponse.Property);
setOwnerData(propertyResponse?.ownerData ?? null);
          setBookingData(propertyResponse.booking);
          // Load features
          //   const featuresResponse = await listAllFeatures();
          //   setFeatures(featuresResponse.features);
          // setFeatures(newProperty.features)
          } catch (error) {
            notifyError('Failed to load property details');
            console.error('Error loading property details:', error);
          } finally {
            setLoading(false);
          }
        };
        const handleApprove = async (propertyId: string) => {
          try {
            const confirm = await Swal.fire({
              title: "Are you sure?",
              text: "You are about to approve this property.",
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: "#28a745",
              cancelButtonColor: "#6c757d", 
              confirmButtonText: "Yes, approve it!",
            });
        
            if (confirm.isConfirmed) {
              const response = await approveProperty(propertyId);
              notifySuccess(response?.message || "Property approved successfully");
              window.location.reload();
            }
          } catch (error) {
            console.error("Approval failed", error);
            Swal.fire("Error", "Something went wrong while approving", "error");
          }
        };
        
          const handleReject = async (propertyId:string) => {
            try {
              const { value: reason } = await Swal.fire({
                title: "Reason for Rejection",
                input: "textarea",
                inputLabel: "Please enter a reason",
                inputPlaceholder: "Type your reason here...",
                inputAttributes: {
                  "aria-label": "Reason",
                },
                showCancelButton: true,
              });
          
              if (!reason) return;
          
              const confirm = await Swal.fire({
                title: "Are you sure?",
                text: "You are about to reject this property.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, reject it!",
              });
          
              if (confirm.isConfirmed) {
                console.log("Rejected property ID:", propertyId);
                console.log("Reason:", reason);
                const response= await rejectProperty(propertyId,reason);
                console.log(response,"checking");
                notifySuccess(response?.message);
          window.location.reload();
                // Call your backend API here if needed
                // await rejectProperty(propertyId, reason);
              }
            } catch (error) {
              console.error("Error during rejection:", error);
              Swal.fire("Error", "Something went wrong. Please try again.", "error");
            }
          };
            const handleViewDetails = (user: IOwner) => {
              setSelectedUser(user);
              setIsModal(true);
            };
  if (!property) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Property Not Found</h2>
        <p className="text-gray-500 mb-4">The property you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/admin/properties')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
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
          <Button variant="outline" size="icon" onClick={() => navigate('/admin/properties')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{property.title}</h1>
          <StatusBadge status={property?.status} />
        </div>
        {/* <div className="flex space-x-2">
          <Button variant="outline" className="text-blue-500">
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="outline" className="text-red-500">
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div> */}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Image Gallery */}
          <div className="aspect-video rounded-lg overflow-hidden mb-6">
            <img
              src={property.images[0] || "https://placehold.co/1200x800?text=No+Image"}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {property.images.map((image, index) => (
              <div key={index} className="w-20 h-20 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <img
                  src={image}
                  alt={`${property.title} image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <h3 className="text-lg font-semibold">About this property</h3>
              <p className="text-gray-600">
                {property.description}
              </p>
              <h4>Rules</h4>
              <p className="text-gray-600">
                {property.rules}
              </p>
              <h4>Cancellation Policy</h4>
              <p className="text-gray-600">
                {property.cancellationPolicy}
              </p>
              <h3 className="text-lg font-semibold mt-4">Location</h3>
              <p className="text-gray-600">{property.address}</p>
              
              {/* <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mt-2"> */}
                  <PropertyMap 
    latitude={property.mapLocation?.coordinates.latitude || 0} // Default to 0 if latitude is null
    longitude={property.mapLocation?.coordinates.longitude || 0} // Default to 0 if longitude is null
    propertyTitle={property.title}
  />
              {/* </div> */}
            </TabsContent>
            
            <TabsContent value="amenities">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.features.map((amenity, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Home className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="bookings">
  {bookingData.length > 0 ? (
    <div className="grid gap-4">
      {bookingData.map((booking:any) => (
        <div
          key={booking._id}
          className="bg-white border border-[#b68451]/30 rounded-lg shadow-sm p-5 hover:shadow-md transition"
        >
          <div className="flex justify-between items-start flex-wrap gap-3">
          <div className="w-full md:w-48 h-32 rounded overflow-hidden">
            <img
              src={booking.propertyImages[0]} 
              alt={booking.propertyName}
              className="w-full h-full object-cover"
            />
          </div>
            <div className="space-y-1 text-sm text-gray-700">
              <p><span className="font-medium text-gray-900">Booking ID:</span> {booking.bookingId}</p>
              <p><span className="font-medium text-gray-900">Status:</span> <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${booking.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'}`}>{booking.bookingStatus}</span></p>
              <p><span className="font-medium text-gray-900">Rent:</span> ₹{booking.rentPerMonth}/month</p>
              <p><span className="font-medium text-gray-900">Move-in:</span> {new Date(booking.moveInDate).toLocaleDateString()}</p>
              <p><span className="font-medium text-gray-900">Booked by:</span> {booking.userId?.name} ({booking.userId?.phone})</p>
              <p className="text-sm text-gray-500">
              Booked At: {new Date(booking.createdAt).toLocaleDateString()}
            </p>
            </div>
            <div className="self-center">
              <Link
                to={`/admin/bookings/${booking._id}`}
                className="inline-block bg-[#b68451] text-white text-sm px-4 py-2 rounded hover:bg-[#a8743f] transition"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center p-8">
      <Calendar className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium">No bookings yet</h3>
      <p className="text-gray-500">This property doesn't have any bookings.</p>
    </div>
  )}
</TabsContent>



          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Property Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 flex-shrink-0">
                    <Home className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</p>
                    <p className="text-sm text-gray-500">Property Type</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start">
                  <div className="w-10 flex-shrink-0">
                    <IndianRupee className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">₹{property.rentPerMonth}/Month</p>
                    <p className="text-sm text-gray-500">Base Price</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start">
                  <div className="w-10 flex-shrink-0">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{ownerData?.name}</p>
                    <p className="text-sm text-gray-500">Property Owner</p>
                    {ownerData && (
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-blue-500"
                                  onClick={() => handleViewDetails(ownerData)}
                    >
                      View Owner Profile
                    </Button>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start">
                  <div className="w-10 flex-shrink-0">
                    {/* <Star className="h-5 w-5 text-gray-500" /> */}
                  </div>
                  {/* <div>
                    {property.rating > 0 ? (
                      <>
                        <p className="font-medium">{property.rating.toFixed(1)} out of 5</p>
                        <p className="text-sm text-gray-500">{property.reviews} reviews</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">No ratings yet</p>
                    )}
                  </div> */}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {property.status === 'pending' && (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-lg font-semibold mb-4">Approval Actions</h3>
      <div className="space-y-3">
        <Button
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={(e) => {
            e.stopPropagation();
            handleApprove(property._id);
            console.log("Approve property", property._id);
          }}
        >
          Approve Property
        </Button>
        <Button
          variant="outline"
          className="w-full border-red-500 text-red-500 hover:bg-red-50"
          onClick={(e) => {
            e.stopPropagation();
            handleReject(property._id);
            console.log("Reject property", property._id);
          }}
        >
          Reject Property
        </Button>
      </div>
    </CardContent>
  </Card>
)} <OwnerDetailsModal
            owner={selectedUser}
            isOpen={isModal}
            onClose={() => setIsModal(false)}
          />

        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default PropertyDetail;