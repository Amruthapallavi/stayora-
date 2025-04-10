
import  { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building, MapPin, BedDouble, Bath, Home, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import Navbar from '../../components/user/Navbar';
import UserLayout from '../../components/user/UserLayout';
// import PropertyListing from './Prop-list';
interface Property {
  _id: string; // Use string for MongoDB _id
  title: string;
  location: string;
  beds: number;
  baths: number;
  type: string;
  price: string;
  image: string;
}
const PropertyListing = () => {
  const {isAuthenticated,user}=useAuthStore();
   const getAllProperties = useAuthStore((state) => state.getAllProperties);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      async function fetchProperties() {
        setLoading(true);
        try {
          const response = await getAllProperties();
          console.log("Fetched data:", response); // Debug API response structure
    
          if (response && Array.isArray(response.properties)) {
            setProperties(response.properties); // Extract 'properties' array
          } else {
            console.warn("Invalid property data format:", response);
            setProperties([]); // Avoid undefined errors
          }
        } catch (error) {
          console.error("Error fetching properties:", error);
          setProperties([]); // Prevent crashes on errors
        } finally {
          setLoading(false);
        }
      }
    
      fetchProperties();
    }, []);
  return (
    <UserLayout>
    <div className="min-h-screen bg-[#ffff]">
  {/* Hero Section */}
  <div className="bg-gradient-to-r from-[#b68451] via-[#c99c66] to-[#d3ae7a] text-white">

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Find Your Perfect Rental Home
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-white/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Discover premium rental properties tailored to your lifestyle and preferences.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {isAuthenticated && user?.role === 'user' ? (
                <Link 
                  to="/user/properties" 
                  className="bg-white text-[#b68451] px-6 py-3 rounded-md font-medium inline-flex items-center shadow-lg hover:bg-gray-100 transition"
                >
                  Manage Your Properties
                  <ArrowRight className="ml-2" size={18} />
                </Link>
              ) : (
                <Link 
                  to="/user/properties" 
                  className="bg-white text-[#b68451] px-6 py-3 rounded-md font-medium inline-flex items-center shadow-lg hover:bg-gray-100 transition"
                >
                  Browse Properties
                  <ArrowRight className="ml-2" size={18} />
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Property Showcase */}
      <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Properties</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Discover our selection of premium rental properties in top locations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.length > 0 ? (
          properties.map((property: any) => (
            <motion.div
              key={property._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              whileHover={{ y: -5 }}
            >
              <div className="relative h-60">
              <img
  src={property.images?.[0] ?? "/placeholder.jpg"}
  alt={property.title}
  className="w-full h-full object-cover rounded-xl"
/>

                <div className="absolute top-0 right-0 bg-[#b68451] text-white px-3 py-1 m-2 rounded-md text-sm font-semibold">
                  ${property.rentPerMonth}/mo
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{property.title}</h3>
                <div className="flex items-center text-[#1f2937] mb-3">
                  <MapPin size={16} className="text-[#b68451] mr-1" />
                  <span>{property?.city}, {property?.district},{property?.state}</span>
                  </div>
                <div className="flex justify-between text-sm text-[#1f2937] mb-4">
                  <div className="flex items-center">
                    <BedDouble size={16} className="mr-1" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center">
                    <Bath size={16} className="mr-1" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center">
                    {(property.type === "Villa" || property.type === "Home") ? (
                      <Home size={16} className="mr-1" />
                    ) : (
                      <Building size={16} className="mr-1" />
                    )}
                    <span>{property.type}</span>
                  </div>
                </div>
                <Link
                  to={`/user/property/${property._id}`}
                  className="block text-center bg-[#dbbd94] text-[#70472e] px-4 py-2 rounded font-medium hover:bg-[#c2956a] hover:text-white transition"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No properties available right now.</p>
        )}
      </div>
    </div>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-golden mb-4">RentalRealm</h3>
              <p className="text-gray-400 max-w-xs">The premium platform for property owners and renters to connect and transact seamlessly.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-golden transition">Home</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-golden transition">Properties</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-golden transition">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-golden transition">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-golden transition">FAQ</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-golden transition">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-golden transition">Terms</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-golden transition">Privacy</a></li>
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                <address className="text-gray-400 not-italic">
                  <p>1234 Property Lane</p>
                  <p>Rental City, RC 56789</p>
                  <p className="mt-3">Email: info@rentalrealm.com</p>
                  <p>Phone: (123) 456-7890</p>
                </address>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} RentalRealm. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </UserLayout>
  );
};

export default PropertyListing;
