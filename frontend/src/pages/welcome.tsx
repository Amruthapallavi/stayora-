import * as React from "react";
import { useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { useAuthStore } from "../stores/authStore";
import { useState, useRef } from "react";
import { Home, Search, Building, MapPin, User, LogIn, Info, ChevronDown, Mail, Phone } from "lucide-react";
import { Button } from "../components/ui/button";

  

const Welcome: React.FC = () => {
  const  { user,isAuthenticated,authType,logout} =useAuthStore();
  //  const [showDropdown, setShowDropdown] = React.useState(false);
 const navigate=useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:5000/")
      .catch((error) => console.error("Error:", error));
  }, []);
  const [showDropdown, setShowDropdown] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const handleProfileClick = () => {
    if (authType === "admin") {
      navigate("/admin/dashboard");
    } else if (authType === "owner") {
      navigate("/owner/dashboard");
    } else {
      navigate("/user/home");
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="absolute w-full top-0 left-0 z-10 bg-transparent p-5">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-yellow-600">Stayora</h1>
          <div className="flex items-center space-x-6 text-white font-medium">
            <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
            {/* <Link to="/about" className="hover:text-yellow-400 transition">About</Link> */}
            {/* <Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link> */}
            <div className="relative">
      <button
        className="flex items-center space-x-2 hover:text-yellow-600"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {isAuthenticated ? <span>{user.name}</span> : <span>Login</span>}
        <FaChevronDown className="text-sm" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40">
          {!isAuthenticated ? (
            <>
              <Link
                to="/user/login"
                className="block px-4 py-2 text-gray-700 hover:bg-yellow-100"
              >
                Login as User
              </Link>
              <Link
                to="/owner/login"
                className="block px-4 py-2 text-gray-700 hover:bg-yellow-100"
              >
                Login as Owner
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={handleProfileClick}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-yellow-100"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  logout(); // Call the logout function
                  setShowDropdown(false);
                  navigate("/"); // Redirect to homepage after logout
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-yellow-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  

          </div>
        </div>
      </nav>

       {/* Hero Section */}
       <div className="relative h-[550px]">
        <img
          src="/images/bg2.jpg"
          alt="Luxury House"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Find Your Dream Home</h2>
          <p className="text-lg md:text-xl text-gray-200">Discover the best homes in your desired location</p>
          <div className="mt-6 flex gap-4">
            <Link to="/user/login" className="bg-yellow-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-yellow-500 transition">
              Find Your Home
            </Link>
            <Link to="/owner/login" className="bg-white text-yellow-600 border border-yellow-600 px-6 py-3 rounded-lg text-lg hover:bg-yellow-600 hover:text-white transition">
              Grow Your Business
            </Link>
          </div>
        </div>
      </div>

      {/* About StayOra Section */}
      <section ref={aboutRef} className="py-16 px-4 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Welcome to StayOra</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            StayOra connects property owners with people searching for their ideal homes. 
            Whether you're looking for a cozy apartment, a spacious house, or a vacation rental, 
            we make the process simple, secure, and satisfying.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
            <div className="bg-yellow-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Easy Search</h3>
            <p className="text-gray-600">
              Find properties with our intuitive search filters. Filter by location, price, amenities, and more.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
            <div className="bg-yellow-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Quality Listings</h3>
            <p className="text-gray-600">
              Browse high-quality, verified property listings with detailed information and authentic images.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
            <div className="bg-yellow-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">User-Friendly</h3>
            <p className="text-gray-600">
              Enjoy a seamless experience from property search to booking or application submission.
            </p>
          </div>
        </div>
      </section>

      {/* For Renters Section */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2" 
                alt="Happy family moving into new home" 
                className="rounded-xl shadow-lg w-full h-[400px] object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">For Home Seekers</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-2 rounded-full mr-4 mt-1">
                    <Search className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-1">Extensive Property Listings</h3>
                    <p className="text-gray-600">Access thousands of verified properties that match your requirements.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-2 rounded-full mr-4 mt-1">
                    <MapPin className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-1">Location-Based Search</h3>
                    <p className="text-gray-600">Find homes in your desired neighborhood or near important locations.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-2 rounded-full mr-4 mt-1">
                    <LogIn className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-1">Simple Application Process</h3>
                    <p className="text-gray-600">Apply for properties directly through our platform with minimal paperwork.</p>
                  </div>
                </div>
              </div>
              <Button className="mt-8 bg-yellow-600 hover:bg-yellow-500 text-white">
                Find Your Home
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* For Property Owners Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col-reverse md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">For Property Owners</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-2 rounded-full mr-4 mt-1">
                    <Building className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-1">Easy Property Listing</h3>
                    <p className="text-gray-600">List your properties with detailed descriptions, high-quality photos, and virtual tours.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-2 rounded-full mr-4 mt-1">
                    <User className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-1">Tenant Screening</h3>
                    <p className="text-gray-600">Access tools to help you find reliable and trustworthy tenants.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-2 rounded-full mr-4 mt-1">
                    <Info className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-1">Property Management</h3>
                    <p className="text-gray-600">Manage your listings, communicate with potential tenants, and track applications.</p>
                  </div>
                </div>
              </div>
              <Button className="mt-8 bg-yellow-600 hover:bg-yellow-500 text-white">
                List Your Property
              </Button>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa" 
                alt="Property owner with keys" 
                className="rounded-xl shadow-lg w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Properties</h2>
            <p className="text-gray-600 text-lg">Discover some of our most popular listings</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="relative h-60">
                  <img
                    src={`https://images.unsplash.com/photo-156518883-ce09059eeff${item}`}
                    alt={`Featured Property ${item}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-600 text-white px-2 py-1 rounded">
                    Featured
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-xl">Modern {item === 1 ? 'Apartment' : item === 2 ? 'House' : 'Villa'}</h3>
                  <div className="flex items-center text-gray-500 mt-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{item === 1 ? 'Downtown' : item === 2 ? 'Suburbs' : 'Beachfront'}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-xl text-yellow-600">${(item * 1000) + 500}/mo</span>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button className="bg-yellow-600 hover:bg-yellow-500 text-white">
              View All Properties
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600 text-lg">Hear from people who found their perfect home through StayOra</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Tenant",
                quote: "StayOra made finding my dream apartment incredibly easy. The filters helped me narrow down exactly what I was looking for."
              },
              {
                name: "Michael Rodriguez",
                role: "Property Owner",
                quote: "As a property owner, I've been able to find reliable tenants quickly. The platform is intuitive and the support team is always helpful."
              },
              {
                name: "Emily Chen",
                role: "Tenant",
                quote: "I was relocating for work and needed to find a place quickly. StayOra's virtual tours saved me so much time in my search."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-16 bg-gray-100 px-4 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Have questions about StayOra? Our team is here to help you with any inquiries.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="How can we help you?"
                  />
                </div>
                <div>
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-2">
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Email</h4>
                    <p className="text-gray-600">support@stayora.com</p>
                    <p className="text-gray-600">info@stayora.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Phone</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">+1 (555) 987-6543</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Location</h4>
                    <p className="text-gray-600">123 Property Street</p>
                    <p className="text-gray-600">San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-yellow-600 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Find Your Perfect Home?</h2>
          <p className="text-yellow-100 text-xl max-w-3xl mx-auto mb-8">
            Join thousands of satisfied users who have found their ideal property through StayOra.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-yellow-600 hover:bg-gray-100">
              <Search className="mr-2 h-5 w-5" /> Search Properties
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-yellow-700">
              <Building className="mr-2 h-5 w-5" /> List Your Property
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">StayOra</h3>
              <p className="text-gray-400">
                Your trusted platform for finding and listing quality rental properties.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {["Home", "About Us", "Properties", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-yellow-400 transition">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">For Users</h4>
              <ul className="space-y-2">
                {["Search Properties", "How It Works", "User Guide", "Support"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-yellow-400 transition">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">For Owners</h4>
              <ul className="space-y-2">
                {["List Property", "Owner Dashboard", "Pricing", "Resources"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-yellow-400 transition">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500">© {new Date().getFullYear()} StayOra. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-500">
                <a href="#" className="hover:text-yellow-400 transition">Privacy Policy</a> | 
                <a href="#" className="hover:text-yellow-400 transition ml-2">Terms of Service</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
