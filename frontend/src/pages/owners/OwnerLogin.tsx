import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";

const OwnerLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log("Owner Login: ", formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3]">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-[#b8860b] p-4 rounded-full">
            <User size={32} className="text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome Back!</h2>
        <form onSubmit={handleSubmit}>
          {[
            { label: "Email Address", name: "email", icon: Mail, type: "email" },
            { label: "Password", name: "password", icon: Lock, type: "password" },
          ].map(({ label, name, icon: Icon, type }) => (
            <div className="mb-4" key={name}>
              <label htmlFor={name} className="block mb-2 text-gray-600">{label}</label>
              <div className="flex items-center border rounded-lg bg-gray-100 px-4">
                <Icon size={20} className="text-gray-500" />
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  className="w-full p-3 bg-transparent focus:outline-none"
                  required
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-[#b8860b] hover:bg-[#a6750a] text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Login
          </button>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account? <a href="/owner/signup" className="text-[#b8860b] hover:underline">Sign up here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default OwnerLogin;