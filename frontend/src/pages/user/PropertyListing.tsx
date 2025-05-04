
import  { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building, MapPin, BedDouble, Bath, Home, ArrowRight, Search, Filter, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import Navbar from '../../components/user/Navbar';
import UserLayout from '../../components/user/UserLayout';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Slider } from '../../components/ui/sidebar';
import HeroSection from '../../components/user/HeroSection';
import CTASection from '../../components/user/CTASection';
import PopularLocations from '../../components/user/PopularLocations';
// import PropertyListing from './Prop-list';
interface Property {
  _id: string; // Use string for MongoDB _id
  title: string;
  location: string;
  beds: number;
  baths: number;
  type: string;
  rentPerMonth: number;
  image: string;
}
const PropertyListing = () => {
  const {filteredProperties}=useAuthStore();
   const getAllProperties = useAuthStore((state) => state.getAllProperties);
    const [properties, setProperties] = useState<Property[]>([]);
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [searchFilters, setSearchFilters] = useState({
      location: "",
      type: "",
      bedrooms: "",
      priceRange: [0, 10000] as [number, number],
    });
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

    const handleFilterChange = (key: string, value: any) => {
      setSearchFilters({
        ...searchFilters,
        [key]: value,
      });
    };
    
    const handleSearch = async () => {
      console.log("Search with filters:", searchFilters);
      const result= await filteredProperties(searchFilters);
      console.log(result,"for filtered")
      setProperties(result);
      navigate("/user/properties", { state: { filters: searchFilters } });
    };
    if (loading) {
      return <div className="text-center">Loading...</div>;
    }
    
  return (
    
    <UserLayout>
<div className="min-h-screen bg-gray-50">
        <HeroSection 
          searchFilters={searchFilters}
          handleFilterChange={handleFilterChange}
          handleSearch={handleSearch}
        /> 
        

      {/* Property Showcase */}
      <div className="container mx-auto px-4 py-16">
      
      {properties.length > 0 && (
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Properties</h2>
    <p className="text-gray-600 max-w-2xl mx-auto">
      Discover our selection of premium rental properties in top locations
    </p>
    <div className="flex justify-end mt-4">
  <select
    className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-golden text-sm"
    onChange={(e) => {
      const sortOption = e.target.value;
      const sorted = [...properties];
      if (sortOption === "lowToHigh") {
        sorted.sort((a, b) => a.rentPerMonth - b.rentPerMonth);
      } else if (sortOption === "highToLow") {
        sorted.sort((a, b) => b.rentPerMonth - a.rentPerMonth);
      }
      setProperties(sorted);
    }}
  >
    <option value="">Sort by</option>
    <option value="lowToHigh">Price: Low to High</option>
    <option value="highToLow">Price: High to Low</option>
  </select>
</div>

  </div>
)}

      
      
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
            ₹{property.rentPerMonth}/mo
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{property.title}</h3>
          <div className="flex items-center text-[#1f2937] mb-3">
            <MapPin size={16} className="text-[#b68451] mr-1" />
            <span>{property?.city}, {property?.district}, {property?.state}</span>
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
    <div className="col-span-full text-center text-gray-500 text-lg py-8">
     <div className="text-center py-20">
                <div className="text-4xl mb-4">😢</div>
                <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search filters</p>
                <button 
                  onClick={() => {
                    setSearchFilters({
                      location: "",
                      type: "",
                      bedrooms: "",
                      priceRange: [0, 10000],
                    });
                    setProperties(properties);
                  }}
                  className="bg-[#b68451] hover:bg-[#d3ae7a]-dark text-white px-4 py-2 rounded-md"
                >
                  Reset Filters
                </button>
              </div>
                  </div>
  )}
</div>

    </div>
    <PopularLocations/>

     {/* Features Section */}
     <section className="bg-gray-100/70 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Why Choose Rental Realm
            </motion.h2>
            <motion.div
              className="w-24 h-1 bg-golden mx-auto mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            ></motion.div>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              The best way to find and rent your next property
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Verified Properties",
                description: "All properties on our platform are verified by our team to ensure quality and authenticity.",
                icon: "🏠",
              },
              {
                title: "Easy Communication",
                description: "Direct and seamless communication between tenants and property owners.",
                icon: "💬",
              },
              {
                title: "Secure Payments",
                description: "Secure and transparent payment system for rent and security deposits.",
                icon: "🔒",
              },
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-4xl mb-4 bg-golden-ultralight p-4 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <CTASection/>
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
