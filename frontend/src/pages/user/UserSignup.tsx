import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { notifySuccess, notifyError } from "../../utils/notifications";
import { useState } from 'react';

const UserSignup = () => {
    const navigate = useNavigate();
    const { signup } = useAuthStore();
  
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
  
    const handleChange = (e:any) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e:any) => {
        e.preventDefault();
        setError("");
  
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          notifyError("Passwords do not match.");
          return;
        }
  
        if (!/^[0-9]{10}$/.test(formData.phone)) {
          setError("Phone number must be exactly 10 digits.");
          notifyError("Phone number must be exactly 10 digits.");
          return;
        }
  
        try {
          await signup(formData, "user");
          notifySuccess("Signup successful. Please verify your email.");
          navigate("/user/verify-otp", {
            state: { email: formData.email, authType: "user" },
          });
        } catch (err:any) {
          const errMsg =
            err.response?.data?.message || "Failed to sign up. Please try again.";
          setError(errMsg);
          notifyError(errMsg);
        } 
      };
  
      
  return (
    
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" >
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
 {/* Left Panel */}
 <div
  className="md:w-1/3 bg-gradient-to-b from-[#C38137] to-[#C3A37F] flex items-center justify-center p-6"
  style={{
    backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/026/586/056/non_2x/beautiful-modern-house-exterior-with-carport-modern-residential-district-and-minimalist-building-concept-by-ai-generated-free-photo.jpg')",
    backgroundSize: "cover",    
    backgroundPosition: "center", 
    backgroundRepeat: "no-repeat", 
  }}
>
  <h2 className="text-white text-2xl font-extrabold tracking-wider">USER SIGNUP</h2>
</div>

          {/* Right Panel */}
          <div className="md:w-2/3 p-6">
            <h2 className="text-2xl font-extrabold text-center mb-6 text-gray-800">Signup</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-600 font-medium">Full Name:</label>
                <input
                  type="text" name='name' value={formData.name} onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-4 focus:ring-[#a0815c] transition duration-300" required
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium">Email:</label>
                <input
                  type="email" name='email' value={formData.email} onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-4 focus:ring-[#a0815c] transition duration-300" required
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium">Phone:</label>
                <input
                  type="tel" name='phone' value={formData.phone} onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-4 focus:ring-[#a0815c] transition duration-300" required
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium">Password:</label>
                <input
                  type="password" name='password' value={formData.password} onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-4 focus:ring-[#a0815c] transition duration-300" required
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium">Confirm Password:</label>
                <input
                  type="password" name='confirmPassword' value={formData.confirmPassword} onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-4 focus:ring-[#a0815c] transition duration-300" required
                />
              </div>
              <div className="text-left mt-2">
                <p className="text-black-600 text-sm ">Already have an account?<Link to='/user/login' className="text-blue-600" > Login </Link></p>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#a0815c] to-[#8a6d4f] text-white py-2 rounded-lg hover:from-[#8a6d4f] hover:to-[#5c4430] transition duration-300 shadow-lg"
              >
                Signup
              </button>

              {/* Google Login */}
              
            </form>
          </div>
        </div>
      </div>
  );
};

export default UserSignup;