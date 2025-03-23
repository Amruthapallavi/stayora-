import * as React from "react";
import { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

const Welcome: React.FC = () => {
  const [showDropdown, setShowDropdown] = React.useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/")
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="absolute w-full top-0 left-0 z-10 bg-transparent p-5">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-yellow-600">Stayora</h1>
          <div className="flex items-center space-x-6 text-white font-medium">
            <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
            <Link to="/about" className="hover:text-yellow-400 transition">About</Link>
            <Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link>
            <div className="relative">
            <button
              className="flex items-center space-x-2 hover:text-yellow-600"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span>Login</span>
              <FaChevronDown className="text-sm" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40">
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
      <div className="text-center my-12 px-6">
        <h2 className="text-3xl font-bold">EXPLORE DESTINATIONS</h2>
        <p className="text-gray-600 mt-2">Select destinations and find your home</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 max-w-5xl mx-auto">
          {[
            "Exotic",
            "Sunrise",
            "Mountain",
            "Cabin",
            "Coastal",
            "Urban",
            "Rural",
            "Lakeview",
          ].map((item) => (
            <div key={item} className="text-center">
              <img
                src="/images/sample-house.jpg"
                alt={item}
                className="rounded-lg shadow-md w-32 h-32 mx-auto object-cover"
              />
              <p className="mt-2 font-semibold">{item}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gray-900 p-8 text-white">
        <div className="max-w-7xl mx-auto flex justify-between flex-wrap">
          <div className="space-y-2">
            <h3 className="font-bold">COMPANY</h3>
            {["Hotels", "Residency", "Villas", "Staycation"].map((item) => (
              <p key={item} className="text-sm text-gray-400">{item}</p>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="font-bold">CONTACT US</h3>
            {["+123 456 7890", "support@stayora.com", "FAQ", "Help Center"].map((item) => (
              <p key={item} className="text-sm text-gray-400">{item}</p>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="font-bold">ABOUT US</h3>
            {["Mission", "Accessibility", "Careers", "Blog", "Support"].map((item) => (
              <p key={item} className="text-sm text-gray-400">{item}</p>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
