import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BedDouble,
  Bath,
  Calendar,
  Home,
  Star,
  Clock,
  Maximize,
  Check,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { notifyError } from "../../utils/notifications";
import { FaRupeeSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import UserLayout from "../../components/user/UserLayout";
import PropertyMap from "../../components/user/PropertyMap";
import { IProperty } from "../../types/property";

interface owner {
  name: string;
  phone: string;
  email: string;
}

const PropertyDetailedPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getPropertyById } = useAuthStore();
  const [property, setProperty] = useState<IProperty | null>(null);
  const [ownerData, setOwnerData] = useState<owner | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    loadPropertyAndFeatures();
  }, [id]);

  const loadPropertyAndFeatures = async () => {
    try {
      setLoading(true);

      const propertyResponse = await getPropertyById(id || "");
      if (!propertyResponse.Property) {
        notifyError("Property not found");
        return;
      }
      setProperty(propertyResponse.Property);
      setOwnerData(propertyResponse?.ownerData ?? null);
    } catch (error) {
      notifyError("Failed to load property details");
      console.error("Error loading property details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (property) {
      navigate(
        `/user/checkout?propertyId=${id}&propertyName=${encodeURIComponent(
          property.title
        )}`
      );
    }
  };
  const handleChatWithOwner = () => {
    navigate(`/user/chat/${property?._id}/${property?.ownerId}`);
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Property Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="bg-golden text-white px-6 py-3 rounded-md shadow-md hover:bg-golden-dark transition"
          >
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
            <Link
              to="/user/properties"
              className="inline-flex items-center text-gray-600 hover:text-golden transition"
            >
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
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {property.title}
                  </h1>

                  {/* Show rating only if averageRating > 0 */}
                  {property.averageRating > 0 && (
                    <div className="flex items-center mb-3 text-yellow-500">
                      {/* Example: 5 stars with filled stars based on rating */}
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(property.averageRating)
                              ? "fill-current"
                              : "text-gray-300"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.176c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.967c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.967a1 1 0 00-.364-1.118L3.622 9.394c-.783-.57-.38-1.81.588-1.81h4.176a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                      ))}

                      {/* Show rating value and total reviews */}
                      <span className="ml-2 text-gray-700 font-semibold">
                        {property.averageRating.toFixed(1)} (
                        {property.totalReviews})
                      </span>
                    </div>
                  )}

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin size={18} className="text-[#b38e5d] mr-2" />
                    <span>{property.address}</span>
                  </div>
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
                    src={
                      property.images[activeImage] ||
                      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf"
                    }
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
                      activeImage === index
                        ? "border-golden shadow-md scale-[1.02]"
                        : "border-transparent"
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
                  <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                    Overview
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <BedDouble
                        size={24}
                        className="mx-auto text-[#b38e5d] mb-2"
                      />
                      <span className="text-sm text-gray-600 block">
                        Bedrooms
                      </span>
                      <span className="font-semibold text-gray-800">
                        {property.bedrooms}
                      </span>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Bath size={24} className="mx-auto text-[#b38e5d] mb-2" />
                      <span className="text-sm text-gray-600 block">
                        Bathrooms
                      </span>
                      <span className="font-semibold text-gray-800">
                        {property.bathrooms}
                      </span>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Home size={24} className="mx-auto text-[#b38e5d] mb-2" />
                      <span className="text-sm text-gray-600 block">Type</span>
                      <span className="font-semibold text-gray-800">
                        {property.type}
                      </span>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <FaRupeeSign
                        size={24}
                        className="mx-auto text-[#b38e5d] mb-2"
                      />
                      <span className="text-sm text-gray-600 block">Rent</span>
                      <span className="font-semibold text-gray-800">
                        ₹{property.rentPerMonth}/month
                      </span>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Star size={24} className="mx-auto text-[#b38e5d] mb-2" />
                      <span className="text-sm text-gray-600 block">
                        Furnishing
                      </span>
                      <span className="font-semibold text-gray-800">
                        {property.furnishing}
                      </span>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Calendar
                        size={24}
                        className="mx-auto text-[#b38e5d] mb-2"
                      />
                      <span className="text-sm text-gray-600 block">
                        Min Lease
                      </span>
                      <span className="font-semibold text-gray-800">
                        {property.minLeasePeriod} months
                      </span>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock
                        size={24}
                        className="mx-auto text-[#b38e5d] mb-2"
                      />
                      <span className="text-sm text-gray-600 block">
                        Max Lease
                      </span>
                      <span className="font-semibold text-gray-800">
                        {property.maxLeasePeriod} months
                      </span>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Maximize
                        size={24}
                        className="mx-auto text-[#b38e5d] mb-2"
                      />
                      <span className="text-sm text-gray-600 block">
                        Location
                      </span>
                      <span className="font-semibold text-gray-800">
                        {property.city}
                      </span>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <PropertyMap
                    latitude={property.mapLocation?.coordinates?.latitude ?? 0}
                    longitude={property.mapLocation?.coordinates.longitude || 0} // Default to 0 if longitude is null
                    propertyTitle={property.title}
                  />
                </motion.div>

                {/* Description */}
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Description
                  </h2>
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
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Features & Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3">
                    {property.features?.map((feature: any, index: any) => (
                      <div key={index} className="flex items-center">
                        <Check size={16} className="text-[#b38e5d] mr-2" />
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
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    House Rules
                  </h2>
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
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Cancellation Policy
                  </h2>
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
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Contact Landlord
                  </h3>
                  <Button
                    onClick={handleChatWithOwner}
                    className="flex items-center gap-2 bg-[#b68451] text-[#ffff]"
                  >
                    <MessageSquare className="h-4 w-4 " />
                    Chat with Owner
                  </Button>

                  {/* <form className="space-y-4">
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
                </form>  */}

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-gray-600 text-sm text-center">
                      Or call directly:{" "}
                      <span className="font-semibold text-[#b38e5d]">
                        {ownerData?.phone}
                      </span>
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
        <Button
          onClick={handleChatWithOwner}
          className="flex items-center gap-2 bg-[#b68451] text-[#ffff]"
        >
          <MessageSquare className="h-4 w-4 " />
          Chat with Owner
        </Button>
      </div>
    </UserLayout>
  );
};

export default PropertyDetailedPage;
