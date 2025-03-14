import * as React from 'react';
// import { useNavigate } from 'react-router-dom';

import  { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Welcome: React.FC = () => {
    
  useEffect(() => {
    axios.get('http://localhost:5000/')
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-yellow-600">Stayora</h1>
          <div className="flex items-center space-x-6 text-gray-700 font-medium">
            <a href="#" className="hover:text-yellow-600">Home</a>
            <a href="#" className="hover:text-yellow-600">Houses</a>
            <a href="#" className="hover:text-yellow-600">About</a>
            <a href="#" className="hover:text-yellow-600">Contact</a>
            <a href="/user/logout" className="hover:text-yellow-600">Login</a>
          </div>
        </nav>

      {/* Hero Section */}
      <div className="relative">
        <img
          src="/images/bg2.jpg"
          alt="Luxury House"
          className="w-full h-[450px] object-cover"
        />
      </div>

      {/* Explore Section */}
      <div className="text-center my-12">
        <h2 className="text-3xl font-bold">EXPLORE DESTINATIONS</h2>
        <p className="text-gray-600 mt-2">Select destinations and find your home</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 max-w-5xl mx-auto">
          {["Exotic", "Sunrise", "Mountain", "Cabin", "Coastal", "Urban", "Rural", "Lakeview"].map((item) => (
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

        <div className="mt-8 flex justify-center gap-6">
          <button className="bg-[#C3A37F] text-white py-2 px-6 rounded-lg hover:bg-[#A38767]"><Link to='/user/login'>Find Your Home</Link></button>
          <button className="border border-[#C3A37F] py-2 px-6 rounded-lg hover:bg-[#F5F5F5]"><Link to='/owner/login'>Grow Your Business</Link></button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#F5F5F5] p-8">
        <div className="flex justify-between flex-wrap">
          <div className="space-y-2">
            <h3 className="font-bold">COMPANY</h3>
            {["Hotels", "Residency", "Villas", "Staycation"].map((item) => (
              <p key={item} className="text-sm text-gray-600">{item}</p>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="font-bold">CONTACT US</h3>
            {["+123 456 7890", "support@stayora.com", "FAQ", "Help Center"].map((item) => (
              <p key={item} className="text-sm text-gray-600">{item}</p>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="font-bold">ABOUT US</h3>
            {["Mission", "Accessibility", "Careers", "Blog", "Support"].map((item) => (
              <p key={item} className="text-sm text-gray-600">{item}</p>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
