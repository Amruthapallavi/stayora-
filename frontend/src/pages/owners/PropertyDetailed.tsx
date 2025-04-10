import  { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, BedDouble, Bath, Calendar, DollarSign, Home, 
  Star, Clock, Maximize, Check, MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import Map from '../../components/owner/map';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {  Edit } from 'lucide-react';
import Sidebar from '../../components/owner/Sidebar';
import { useAuthStore } from '../../stores/authStore';
import { notifyError } from '../../utils/notifications';
import { FaRupeeSign } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import UserLayout from '../../components/user/UserLayout';
import OwnerLayout from '../../components/owner/OwnerLayout';

// const newProperty={
//     id: '1',
//     title: 'Luxury Apartment in Downtown',
//     type: 'Apartment',
//     minLeasePeriod: 6,
//     maxLeasePeriod: 24,
//     bedrooms: 2,
//     bathrooms: 2,
//     address: '123 Main St',
//     houseNumber: '123',
//     street: 'Main St',
//     city: 'New York',
//     district: 'Manhattan',
//     state: 'NY',
//     pincode: '10001',
//     rentPerMonth: 2500,
//     furnishing: 'Fully-Furnished',
//     description: 'Beautiful apartment in the heart of downtown with amazing city views.',
//     rules: 'No smoking. No pets.',
//     cancellationPolicy: '30 days notice required',
//     features: ['1', '2', '3', '7', '9'],
//     otherFeatures: ['Rooftop Access', 'City Views'],
//     images: [
//       'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
//       'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
//       'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'
//     ],
//     mapLocation: { lat: 40.712776, lng: -74.005974 }
//   }
 interface Property {
    _id: string;
    ownerId: string;
    title: string;
    type: string;
    description: string;
    address: string;
    city: string;
    state: string;
    pincode: number;
    bedrooms: number;
    bathrooms: number;
    furnishing: 'Fully-Furnished' | 'Semi-Furnished' | 'Unfurnished';
    rentPerMonth: number;
    images: string[];
    minLeasePeriod: number;
    maxLeasePeriod: number;
    rules: string;
    cancellationPolicy: string;
    features: string[]; 
    location: {
      coordinates: {
        latitude: number | null;
        longitude: number | null;
      };
    };
    isApproved: boolean;
    createdAt: string; 
    updatedAt: string; 
  }
  
  interface owner{
    name:string,
    phone:string,
    email:string
  }

const OwnerPropertyDetailedPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getPropertyById, listAllFeatures } = useAuthStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [ownerData, setOwnerData] = useState<owner |null >(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const navigate=useNavigate();
  useEffect(() => {
    loadPropertyAndFeatures();
  }, [id]);
  
  const loadPropertyAndFeatures = async () => {
    try {
      setLoading(true);
      
      // Load property details
      const propertyResponse = await getPropertyById(id || '');
      console.log(propertyResponse)
      if (!propertyResponse.Property) {
        notifyError('Property not found');
        return;
      }
    //   setProperty(propertyResponse.property);
    setProperty(propertyResponse.Property);
    setOwnerData(propertyResponse.ownerData);
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
console.log(property,"checking the detailed")
  const handleBookNow = () => {
    navigate(`/user/checkout?propertyId=${id}&propertyName=${encodeURIComponent(property.title)}`);
  };
    const handleDeleteProperty = () => {
      // In a real app, this would call an API to delete the property
      try {
        // Simulate API call
        setTimeout(() => {
          notifySuccess("Property has been deleted successfully");
          navigate("/owner/properties");
        }, 1000);
      } catch (error) {
        notifyError("Failed to delete property");
      }
    };
  
    const handleShareProperty = () => {
      // Copy the public URL to clipboard
      const publicUrl = `${window.location.origin}/property/${id}`;
      navigator.clipboard.writeText(publicUrl);
      notifySuccess("Property link copied to clipboard");
    };
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-golden"></div>
      </div>
    );
  }
  
  if (!property) {
    return (
        <OwnerLayout>
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="bg-golden text-white px-6 py-3 rounded-md shadow-md hover:bg-golden-dark transition">
            Back to Home
          </Link>
        </div>
      </div>
      </OwnerLayout>
    );
  }
  
//   const propertyFeatures = features
//     .filter(feature => property.features?.includes(feature._id))
//     .map(feature => feature.name);
  
  return (
    <OwnerLayout>
      <div className="flex min-h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with navigation */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <Link to="/owner/properties" className="text-gray-500 hover:text-gray-700 mr-3">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-bold text-golden-dark">{property.title}</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* <Button variant="outline" onClick={handleShareProperty} className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button> */}
              <Link to={`/owner/edit-property/${property._id}`}>
                <Button variant="outline" className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              </Link>
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="flex items-center">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Property</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this property? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteProperty}>
                      Delete Property
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Property image gallery */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2">
              {property.images && property.images.length > 0 ? (
                <>
                  <div className="md:col-span-2 h-64 md:h-96">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 h-64 md:h-96">
                    {property.images.slice(1, 3).map((image: string, index: number) => (
                      <div key={index} className="h-full">
                        <img
                          src={image}
                          alt={`${property.title} ${index + 2}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                    {property.images.length > 3 && (
                      <div className="relative h-full col-span-2">
                        <img
                          src={property.images[3]}
                          alt={`${property.title} 4`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {property.images.length > 4 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <span className="text-white text-xl font-semibold">+{property.images.length - 4} more</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="col-span-3 h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                  <Home size={64} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Property details tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="rules">Rules & Policies</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
            
            {/* Overview tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Property Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{property.description}</p>
                    
                    <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-5 w-5 text-golden mr-2" />
                        <span>
                          {property.houseNumber} {property.street}, {property.city}, {property.state} {property.pincode}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>At a Glance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center">
                        <BedDouble className="h-5 w-5 text-golden mr-2" />
                        <span>Bedrooms</span>
                      </div>
                      <span className="font-semibold">{property.bedrooms}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center">
                        <Bath className="h-5 w-5 text-golden mr-2" />
                        <span>Bathrooms</span>
                      </div>
                      <span className="font-semibold">{property.bathrooms}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-golden mr-2" />
                        <span>Property Type</span>
                      </div>
                      <span className="font-semibold">{property.type}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-golden mr-2" />
                        <span>Monthly Rent</span>
                      </div>
                      <span className="font-semibold">${property.rentPerMonth}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-golden mr-2" />
                        <span>Min. Lease</span>
                      </div>
                      <span className="font-semibold">{property.minLeasePeriod} months</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-golden mr-2" />
                        <span>Max. Lease</span>
                      </div>
                      <span className="font-semibold">{property.maxLeasePeriod} months</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Details tab */}
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Address</h3>
                      <p>{property.houseNumber} {property.street}</p>
                      <p>{property.city}, {property.state} {property.pincode}</p>
                      {property.district && <p>District: {property.district}</p>}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Property Information</h3>
                      <p>Type: {property.type}</p>
                      <p>Bedrooms: {property.bedrooms}</p>
                      <p>Bathrooms: {property.bathrooms}</p>
                      <p>Furnishing: {property.furnishing}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Lease Terms</h3>
                      <p>Rent: ${property.rentPerMonth}/month</p>
                      <p>Minimum Lease: {property.minLeasePeriod} months</p>
                      <p>Maximum Lease: {property.maxLeasePeriod} months</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Location tab */}
            <TabsContent value="location">
              <Card>
                <CardHeader>
                  <CardTitle>Property Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    {property.mapLocation && (
                      <Map selectedLocation={property.mapLocation} onLocationSelect={() => {}} />
                    )}
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="font-medium">Address:</p>
                    <p>{property.houseNumber} {property.street}, {property.city}, {property.state} {property.pincode}</p>
                    {property.mapLocation && (
                      <p className="mt-2">
                        <span className="font-medium">Coordinates: </span>
                        {property.mapLocation.lat.toFixed(6)}, {property.mapLocation.lng.toFixed(6)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Rules tab */}
            <TabsContent value="rules">
              <Card>
                <CardHeader>
                  <CardTitle>Rules & Policies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">House Rules</h3>
                    <p className="text-gray-700">{property.rules || "No specific rules provided."}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Cancellation Policy</h3>
                    <p className="text-gray-700">{property.cancellationPolicy || "No cancellation policy provided."}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Features tab */}
            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle>Features & Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-700 mb-3">Property Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.features && property.features.map((featureId: string) => (
                        <Badge key={featureId} variant="secondary" className="px-3 py-1">
                          {featureId}
                        </Badge>
                      ))}
                      {(!property.features || property.features.length === 0) && (
                        <p className="text-gray-500">No features specified</p>
                      )}
                    </div>
                  </div>
                  
                  {/* {property.otherFeatures && property.otherFeatures.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3">Other Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {property.otherFeatures.map((feature: string, index: number) => (
                          <Badge key={index} variant="outline" className="px-3 py-1">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )} */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    </OwnerLayout>
  );
};

export default OwnerPropertyDetailedPage;
