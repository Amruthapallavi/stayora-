
const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-white shadow-md">
        <h1 className="text-2xl font-semibold text-[#6F4F28]">Stayora</h1>
        <ul className="flex space-x-8 text-sm">
          <li className="hover:underline cursor-pointer">HOME</li>
          <li className="hover:underline cursor-pointer">ABOUT</li>
          <li className="hover:underline cursor-pointer">CONTACT</li>
          <li className="hover:underline cursor-pointer">LOGIN</li>
        </ul>
      </nav>

      {/* Hero Image */}
      <div className="w-full h-[400px]">
        <img
          src="/images/hero.jpg"
          alt="Luxury House"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Login Form */}
      <div className="flex justify-center items-center flex-grow">
        <div className="w-full max-w-md p-8">
          <h2 className="text-lg font-semibold mb-6">Login</h2>

          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Username or email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F4F28]"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6F4F28]"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#6F4F28] text-white rounded-md hover:bg-[#5A3F20]">
              Login
            </button>
          </form>

          <p className="mt-4 text-sm">
            Don't have an account?{' '}
            <a href="/signup" className="text-[#6F4F28] underline">Sign up</a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#F5F5F5] p-8">
        <div className="grid grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="font-semibold mb-2">EXPLORE</h3>
            <ul>
              <li>HOSTELS</li>
              <li>WOMENS</li>
              <li>STUDENTS(BOYS)</li>
              <li>STUDENTS(GIRLS)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">CONNECT US</h3>
            <ul>
              <li>Emergency services</li>
              <li>CONTACT US</li>
              <li>FAQS</li>
              <li>Location</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">ABOUT US</h3>
            <ul>
              <li>Hostels</li>
              <li>Availability</li>
              <li>Road to know</li>
              <li>Support</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;




// second login


import React from "react";

const AdminLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center"   style={{ backgroundImage: "url('/images/bg.jpg')" }}>
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden transform hover:scale-105 transition-transform duration-500">

        {/* Left Panel */}
        <div className="md:w-1/3 bg-gradient-to-b from-[#8a6d4f] to-[#5c4430] flex items-center justify-center p-12">
          <h2 className="text-white text-4xl font-extrabold tracking-wider">ADMIN LOGIN</h2>
        </div>

        {/* Right Panel */}
        <div className="md:w-2/3 p-12">
          <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Welcome Back</h2>

          <form className="space-y-6">
            <div>
              <label className="block text-gray-600 font-medium">Email:</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full mt-3 p-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-[#a0815c] transition duration-300"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium">Password:</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full mt-3 p-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-[#a0815c] transition duration-300"
              />
              <div className="text-right mt-3">
                <a href="#" className="text-blue-600 text-sm hover:underline">Forgot password?</a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#a0815c] to-[#8a6d4f] text-white py-3 rounded-lg hover:from-[#8a6d4f] hover:to-[#5c4430] transition duration-300 shadow-lg"
            >
              Login
            </button>

            {/* Google Login */}
            <button
              type="button"
              className="w-full mt-6 border flex items-center justify-center py-3 rounded-lg hover:bg-gray-100 transition duration-300 shadow-sm"
            >
              <img
                src="/google-icon.svg"
                alt="Google"
                className="w-6 h-6 mr-3"
              />
              Login with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
