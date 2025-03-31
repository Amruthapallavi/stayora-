// import React from "react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import Navbar from "../../components/user/Navbar";
interface FilterState {
  location: string;
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  bathrooms: number;
}

const UserHomePage = () => {

  const navigate = useNavigate();
  // const {logout} = useAuthStore();
  //   const [filters, setFilters] = useState<FilterState>({
  //   location: "NewYork",
  //   propertyType: "Apartment",
  //   minPrice: 20000,
  //   maxPrice: 200000,
  //   bedrooms: 1,
  //   bathrooms: 1,
  // });

  // Handle changes in filters
  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setFilters((prev) => ({
  //     ...prev,
  //     [name]: name.includes("Price") ? Number(value) : value,
  //   }));
  // };
  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     navigate("/", { replace: true }); 
  //   }

  //   window.history.pushState(null, "", window.location.href);
  //   window.onpopstate = function () {
  //     window.history.pushState(null, "", window.location.href);
  //   };
  // }, [navigate]);


  // const handleSubmit = () => {
  //   console.log("Filters Applied: ", filters);
  // };
 
    return (
      <div className="bg-gray-100 text-gray-900">
        {/* Navbar */}
        
      <Navbar/>
        {/* Hero Section */}
        <section
        
         className="relative h-[500px] bg-cover bg-center" >
       
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center " style={{ backgroundImage: "url('/images/bg.jpg')" }}>
            <div className="text-center text-white">
              <h2 className="text-5xl font-extrabold mb-4">Find Your Dream Home</h2>
              <p className="text-lg max-w-xl mx-auto mb-6">
                Discover the best and most beautiful houses at affordable prices, loved by our users.
              </p>
              <button className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-semibold text-lg transition">
                Explore Listings
              </button>
            </div>
          </div>
         
        </section>
        {/* <div className="relative -mt-20 max-w-7xl mx-auto bg-[#1B263B] rounded-xl p-6 shadow-lg"> */}
        {/* <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center"> */}
          {/* Location */}
          {/* <div>
            <label className="text-sm uppercase tracking-wide">Location</label>
            <select
              name="location"
              value={filters.location}
              onChange={handleChange}
              className="mt-2 w-full bg-transparent border border-gray-600 p-2 rounded-lg focus:ring-yellow-500"
            >
              <option value="NewYork">NewYork</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div> */}

          {/* Property Type */}
          {/* <div>
            <label className="text-sm uppercase tracking-wide">Property Type</label>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleChange}
              className="mt-2 w-full bg-transparent border border-gray-600 p-2 rounded-lg focus:ring-yellow-500"
            >
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Studio">Studio</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div> */}

          {/* Price Range */}
          {/* <div>
            <label className="text-sm uppercase tracking-wide">Price ($)</label>
            <div className="flex mt-2 space-x-2">
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                placeholder="Min"
                className="w-1/2 bg-transparent border border-gray-600 p-2 rounded-lg"
              />
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                placeholder="Max"
                className="w-1/2 bg-transparent border border-gray-600 p-2 rounded-lg"
              />
            </div>
          </div> */}

          {/* Bedrooms */}
          {/* <div>
            <label className="text-sm uppercase tracking-wide">Bed Room</label>
            <select
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleChange}
              className="mt-2 w-full bg-transparent border border-gray-600 p-2 rounded-lg"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div> */}

          {/* Bathrooms */}
          {/* <div>
            <label className="text-sm uppercase tracking-wide">Bath Room</label>
            <select
              name="bathrooms"
              value={filters.bathrooms}
              onChange={handleChange}
              className="mt-2 w-full bg-transparent border border-gray-600 p-2 rounded-lg"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div> */}

          {/* Search Button */}
          {/* <button
            onClick={handleSubmit}
            className="mt-6 md:mt-0 bg-[#F77F00] text-white p-3 rounded-lg hover:bg-[#FFA500] transition duration-300 flex items-center justify-center"
          >
            🔍
          </button> */}
        {/* </div> */}
      {/* </div> */}
        {/* Top Rated Houses */}
        <section className="py-16 bg-white">
          <h3 className="text-center text-4xl font-bold mb-4">Top Rated Houses</h3>
          <p className="text-center max-w-2xl mx-auto mb-12 text-gray-600">
            The best and most beautiful houses with high ratings and affordable prices.
          </p>
  
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
            {[
              {
                id: 1,
                title: "Dream Land 5 BHK Villa",
                location: "Whitefield, Bangalore",
                specs: "5 BHK | 3 Bath | 5000 sq.ft",
                facilities: "Fully Furnished | 4 Parking",
                price: "$5000/Month",
                img: "/villa1.jpg",
              },
              {
                id: 2,
                title: "Dream Land 5 BHK Villa",
                location: "Whitefield, Bangalore",
                specs: "5 BHK | 3 Bath | 5000 sq.ft",
                facilities: "Fully Furnished | 4 Parking",
                price: "$5000/Month",
                img: "/villa2.jpg",
              },
              {
                id: 3,
                title: "Dream Land 5 BHK Villa",
                location: "Mysore, Bangalore",
                specs: "5 BHK | 3 Bath | 5000 sq.ft",
                facilities: "Fully Furnished | 4 Parking",
                price: "$5000/Month",
                img: "/villa3.jpg",
              },
            ].map((house) => (
              <div key={house.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src={house.img} alt={house.title} className="w-full h-60 object-cover" />
                <div className="p-6">
                  <h4 className="text-xl font-semibold mb-2">{house.title}</h4>
                  <p className="text-gray-600 mb-1">{house.location}</p>
                  <p className="text-gray-600 mb-1">{house.specs}</p>
                  <p className="text-gray-600 mb-4">{house.facilities}</p>
                  <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg">
                    {house.price}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
  
        {/* Find The Best Section */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 px-8 mb-8 md:mb-0">
              <h3 className="text-3xl font-bold mb-4">Find The Best</h3>
              <p className="text-gray-600 leading-relaxed">
                Discover beautiful houses with premium amenities, perfect locations, and modern designs.
                We offer top-rated homes that meet your needs at an affordable price.
              </p>
            </div>
            <div className="md:w-1/2 px-8">
              <img src="/images/bg.jpg" alt="Luxury Villa" className="rounded-lg shadow-md" />
            </div>
          </div>
        </section>
  
        {/* Why Choose Us Section */}
        <section className="py-16 bg-white text-center">
          <h3 className="text-3xl font-bold mb-8">Why Choose Us?</h3>
          <div className="flex justify-center space-x-16">
            <div>
              <h4 className="text-xl font-semibold mb-2">Best Homes</h4>
              <p className="text-gray-600">We provide premium homes with affordable prices for you.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">Great Features</h4>
              <p className="text-gray-600">Our homes come with top-notch amenities and modern designs.</p>
            </div>
          </div>
        </section>
  
        {/* Footer */}
        <footer className="bg-yellow-700 text-white py-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="font-bold mb-2">Explore</h4>
              <p>Houses</p>
              <p>Categories</p>
              <p>About Us</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Contact Us</h4>
              <p>Email: contact@stayora.com</p>
              <p>Phone: +1-234-567-890</p>
              <p>Location: Bangalore, India</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Get Started</h4>
              <p>Login</p>
              <p>Register</p>
              <p>Find Homes</p>
            </div>
          </div>
        </footer>
      </div>
    );
  };
  
  export default UserHomePage;
  