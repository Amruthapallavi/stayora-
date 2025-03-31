import { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { CameraIcon } from "lucide-react";
import Navbar from "../../components/user/Navbar";

// User Profile Interface
interface UserProfileData {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  joined: string;
  profileImage: string;
}

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfileData>({
    name: "Sophie Anderson",
    role: "Senior Product Designer",
    email: "sophie.anderson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    joined: "January 2020",
    profileImage: "https://randomuser.me/api/portraits/women/68.jpg",
  });

  const [formData, setFormData] = useState<UserProfileData>({ ...user });

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile image upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prevData) => ({ ...prevData, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save edited profile
  const handleSave = () => {
    setUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900">
      <Navbar />

      {/* Profile Section */}
      <section className="flex flex-col items-center mt-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3 text-center"
        >
          {/* Profile Image */}
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <label className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full shadow-md cursor-pointer">
              <CameraIcon size={16} />
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          {/* User Info */}
          <h2 className="text-xl font-semibold mt-3">{user.name}</h2>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-sm mt-1">
            {user.role}
          </span>

          {/* Details */}
          <div className="mt-4 space-y-2 text-sm">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Location:</strong> {user.location}</p>
            <p><strong>Member since:</strong> {user.joined}</p>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700 transition"
            >
              Edit Profile
            </button>
            <button className="w-full border py-2 rounded-md hover:bg-gray-100 transition">
              Change Password
            </button>
          </div>
        </motion.div>
      </section>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3"
          >
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border p-2 rounded-md mb-2"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border p-2 rounded-md mb-2"
            />

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full border p-2 rounded-md mb-2"
            />

            <div className="flex gap-2 mt-4">
              <button
                className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700 transition"
                onClick={handleSave}
              >
                Save Changes
              </button>
              <button
                className="w-full bg-gray-200 text-gray-900 py-2 rounded-md hover:bg-gray-300 transition"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
