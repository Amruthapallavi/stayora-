import  { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, BedDouble, Bath, Calendar, DollarSign, Home, 
  Star, Clock, Maximize, Check, MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { notifyError } from '../../utils/notifications';
import { FaRupeeSign } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import UserLayout from '../../components/user/UserLayout';

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

const PropertyDetailedPage = () => {
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

  const handleBookNow = () => {
    navigate(`/user/checkout?propertyId=${id}&propertyName=${encodeURIComponent(property.title)}`);
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
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="bg-golden text-white px-6 py-3 rounded-md shadow-md hover:bg-golden-dark transition">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
//   const propertyFeatures = features
//     .filter(feature => property.features?.includes(feature._id))
//     .map(feature => feature.name);
  
  return (
    <UserLayout>
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Back button */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/user/properties" className="inline-flex items-center text-gray-600 hover:text-golden transition">
            <ArrowLeft size={18} className="mr-2" />
            <span>Back to properties</span>
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Property header */}
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin size={18} className="text-[#b38e5d] mr-2" />
                <span>{property.address}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
                onClick={handleBookNow}
                className="bg-[#b38e5d] hover:bg-[#92643f] text-white font-medium text-lg px-8 py-6"
              >
                Book Now
              </Button>
            </div>
          </div>
          
       
          
          {/* Image gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            {/* Main image */}
            <div className="lg:col-span-2">
              <div className="relative rounded-xl overflow-hidden h-[400px] shadow-md">
                <img 
                  src={property.images[activeImage] || 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf'} 
                  alt={property.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Thumbnail grid */}
            <div className="grid grid-cols-2 gap-3 h-[400px] overflow-y-auto pr-2">
              {property.images.map((image: string, index: number) => (
                <div 
                  key={index}
                  className={`cursor-pointer rounded-lg overflow-hidden h-[120px] border-2 transition-all ${
                    activeImage === index ? 'border-golden shadow-md scale-[1.02]' : 'border-transparent'
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${property.title} ${index + 1}`} 
                    className="w-full h-full object-cover hover:opacity-90 transition"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Content area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <BedDouble size={24} className="mx-auto text-[#b38e5d] mb-2" />
                    <span className="text-sm text-gray-600 block">Bedrooms</span>
                    <span className="font-semibold text-gray-800">{property.bedrooms}</span>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Bath size={24} className="mx-auto text-[#b38e5d] mb-2" />
                    <span className="text-sm text-gray-600 block">Bathrooms</span>
                    <span className="font-semibold text-gray-800">{property.bathrooms}</span>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Home size={24} className="mx-auto text-[#b38e5d] mb-2" />
                    <span className="text-sm text-gray-600 block">Type</span>
                    <span className="font-semibold text-gray-800">{property.type}</span>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <FaRupeeSign size={24} className="mx-auto text-[#b38e5d] mb-2" />
                    <span className="text-sm text-gray-600 block">Rent</span>
                    <span className="font-semibold text-gray-800">₹{property.rentPerMonth}/month</span>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Star size={24} className="mx-auto text-[#b38e5d] mb-2" />
                    <span className="text-sm text-gray-600 block">Furnishing</span>
                    <span className="font-semibold text-gray-800">{property.furnishing}</span>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Calendar size={24} className="mx-auto text-[#b38e5d] mb-2" />
                    <span className="text-sm text-gray-600 block">Min Lease</span>
                    <span className="font-semibold text-gray-800">{property.minLeasePeriod} months</span>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Clock size={24} className="mx-auto text-[#b38e5d] mb-2" />
                    <span className="text-sm text-gray-600 block">Max Lease</span>
                    <span className="font-semibold text-gray-800">{property.maxLeasePeriod} months</span>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Maximize size={24} className="mx-auto text-[#b38e5d] mb-2" />
                    <span className="text-sm text-gray-600 block">Location</span>
                    <span className="font-semibold text-gray-800">{property.city}</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Description */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {property.description}
                </p>
              </motion.div>
              
              {/* Features */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3">
                  {property.features?.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check size={16} className="text-[#b38e5d] mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                  {property.otherFeatures?.map((feature: string, index: number) => (
                    <div key={`other-${index}`} className="flex items-center">
                      <Check size={16} className="text-golden mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Rules */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">House Rules</h2>
                <p className="text-gray-600 leading-relaxed">
                  {property.rules}
                </p>
              </motion.div>
              
              {/* Cancellation Policy */}
              <motion.div 
                className="bg-white p-6 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">Cancellation Policy</h2>
                <p className="text-gray-600 leading-relaxed">
                  {property.cancellationPolicy}
                </p>
              </motion.div>
            </div>
            
            {/* Sidebar - Contact card */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white p-6 rounded-xl shadow-sm sticky top-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Landlord</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-golden focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">Your Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-golden focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-1">Your Phone</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-golden focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-1">Message</label>
                    <textarea 
                      id="message" 
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-golden focus:border-transparent"
                      placeholder="I'm interested in this property..."
                    ></textarea>
                  </div>
                  <button 
                    type="button" 
                    className="w-full bg-[#b38e5d] text-white py-3 rounded-md shadow-md hover:bg-golden-dark transition"
                  >
                    Send Message
                  </button>
                </form>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-gray-600 text-sm text-center">
                    Or call directly: <span className="font-semibold text-[#b38e5d]">{ownerData?.phone}</span>
                  </p>
                
                
                <div className="flex items-center gap-3 mt-5">
                  <Phone className="text-[#b38e5d]" size={20} />
                  <span>{ownerData?.phone}</span>
                </div>
                
                <div className="flex items-center gap-3 mt-3">
                  <Mail className="text-[#b38e5d]" size={20} />
                  <span>{ownerData?.email}</span>
                </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
    </UserLayout>
  );
};

export default PropertyDetailedPage;
