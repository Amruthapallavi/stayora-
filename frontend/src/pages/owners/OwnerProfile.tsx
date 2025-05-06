import { useEffect, useState } from "react";
// import Sidebar from "../../components/owner/Sidebar";
import { User, Lock, UploadCloud, ShieldAlert } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { BadgeCheck } from "lucide-react";
import { notifyError, notifySuccess } from "../../utils/notifications";
import OwnerLayout from "../../components/owner/OwnerLayout";
import { IOwner, ProfileFormType } from "../../types/IOwner";

export default function OwnerProfile() {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ user: IOwner } | null>(null);
  
  const { updateOwner, changePassword, user, getUserData, isAuthenticated } =
    useAuthStore();
    const [updatedUser, setUpdatedUser] = useState<ProfileFormType>({
      name: "",
      phone: "",
      address: {
        houseNo: "",
        street: "",
        city: "",
        district: "",
        state: "",
        pincode: "",
      },
      email: "",
    });
    

      
    useEffect(() => {
      if (userData?.user) {
        setUpdatedUser({
          name: userData.user.name || "",
          phone: userData.user.phone || "",
          email: userData.user.email || "", 
          address: userData.user.address || {
            houseNo: "",
            street: "",
            city: "",
            district: "",
            state: "",
            pincode: "",
          },
        });
      }
    }, [userData?.user]);
    
      

  useEffect(() => {
    if (user?.id) {

      getUserData(user.id, "owner")
        .then((data) => {
          setUserData(data);

        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });

    }
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  
  const handleUpdateProfile = async (
    e: React.FormEvent<HTMLFormElement>,
    userId: string
  ) => {
    e.preventDefault();
  
    if (!userId || !updatedUser.phone || !updatedUser.name) {
      notifyError("All fields are required.");
      return;
    }
  
    try {
      await updateOwner(userId, updatedUser);
      notifySuccess("Profile updated successfully");
      window.location.reload();
    } catch (err) {
      notifyError(err.response?.data?.message || "Failed to update profile.");
    }
  
    setActiveForm(null);
  };
  
 
  
  const handleChangePassword = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    changePassword({
      oldPassword: formData.get("oldPassword"),
      newPassword: formData.get("newPassword"),
    });
    setActiveForm(null);
  };
 

  return (
    <OwnerLayout>
    <div className="flex bg-[#fffff] text-white min-h-screen">
      {/* Sidebar */}
      {/* <Sidebar /> */}

      <div className="flex-1 flex flex-col md:flex-row gap-6 p-6">
  {/* Left Side - Profile Box */}
  <div className="w-full md:w-1/3 bg-[#A98E60] p-6 rounded-lg shadow-lg text-white">
    {/* Profile Details */}
    <div className="flex flex-col items-center">
      <img
        src="https://static.vecteezy.com/system/resources/previews/020/213/738/original/add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg"
        alt="Profile"
        className="w-24 h-24 rounded-full border-4 border-white mb-3"
      />
      <p className="text-lg font-semibold">{userData?.user?.name}</p>
      <p className="text-sm opacity-90 flex items-center">
        {userData?.user?.isVerified && (
          <BadgeCheck className="text-blue-500 w-5 h-5 mr-1" />
        )}
        {userData?.user?.email}
      </p>
    </div>
  
    <hr className="my-4 border-white opacity-50" />

    {/* User Data List */}
    <div className="text-sm bg-white p-4 rounded-lg border border-[#4A4A4A] text-[#A98E60]">
      <p className="mb-2">
        <span className="font-semibold">Phone:</span> {userData?.user?.phone || "Not Provided"}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Role:</span> {user.role || "Owner"}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Joined:</span>{" "}
        {userData?.user?.createdAt ? new Date(userData.user.createdAt).toLocaleDateString() : "N/A"}
      </p>
     <p>
  <span className="font-semibold">Status:</span>{" "}
  <span
    className={
      (userData?.user?.status || user?.status) === "Active"
        ? "text-green-600"
        : "text-red-500"
    }
  >
    {userData?.user?.status || user?.status || "Unknown"}
  </span>
</p>

    </div>

    <hr className="my-4 border-white opacity-50" />

    {/* Action Buttons */}
    <button
      onClick={() => setActiveForm(activeForm === "editProfile" ? null : "editProfile")}
      className={`w-full flex items-center gap-2 px-4 py-2 ${
        activeForm === "editProfile" ? "bg-white text-[#A98E60]" : "bg-[#4A4A4A] hover:bg-gray-700 text-white"
      } rounded-lg transition`}
    >
      <User size={18} /> Edit Profile
    </button>

    <button
      onClick={() => setActiveForm(activeForm === "changePassword" ? null : "changePassword")}
      className={`w-full flex items-center gap-2 px-4 py-2 mt-3 ${
        activeForm === "changePassword" ? "bg-red-500 text-white" : "bg-[#4A4A4A] hover:bg-gray-700 text-white"
      } rounded-lg transition`}
    >
      <Lock size={18} /> Change Password
    </button>
  </div>

  {/* Right Side - Form Section */}
  <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-lg text-[#2D2D2D] border border-[#A98E60]">
    {activeForm === "editProfile" && (
      <form onSubmit={(e) => handleUpdateProfile(e, userData!.user._id!)} className="flex flex-col gap-3 mb-4">
      <h2 className="text-xl font-semibold mb-2 text-[#A98E60]">Edit Profile</h2>
        <input
          type="text"
          name="name"
          defaultValue={userData?.user?.name || ""}
          onChange={handleInputChange}
          placeholder="Full Name"
          className="p-2 border border-[#A98E60] bg-gray-100 rounded"
        />
        <input
          type="tel"
          name="phone"
          defaultValue={userData?.user?.phone || ""}
          onChange={handleInputChange}
          placeholder="Phone"
          className="p-2 border border-[#A98E60] bg-gray-100 rounded"
        />
        <input
          type="text"
          name="address"
          defaultValue={userData?.user?.address.city || ""}
          onChange={handleInputChange}
          placeholder="Address"
          className="p-2 border border-[#A98E60] bg-gray-100 rounded"
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-[#A98E60] hover:bg-[#916D40] py-2 px-4 rounded text-white transition w-full">
            Save Changes
          </button>
          <button type="button" onClick={() => setActiveForm(null)} className="bg-gray-600 hover:bg-gray-500 py-2 px-4 rounded text-white">
            Cancel
          </button>
        </div>
      </form>
    )}

    {activeForm === "changePassword" && (
      <form onSubmit={handleChangePassword} className="flex flex-col gap-3 mb-4">
        <h2 className="text-xl font-semibold mb-2 text-[#A98E60]">Change Password</h2>
        <input type="password" name="oldPassword" placeholder="Old Password" className="p-2 border border-[#A98E60] bg-gray-100 rounded" />
        <input type="password" name="newPassword" placeholder="New Password" className="p-2 border border-[#A98E60] bg-gray-100 rounded" />
        <div className="flex gap-2">
          <button type="submit" className="bg-red-500 hover:bg-red-600 py-2 px-4 rounded text-white">
            Update Password
          </button>
          <button type="button" onClick={() => setActiveForm(null)} className="bg-gray-600 hover:bg-gray-500 py-2 px-4 rounded text-white">
            Cancel
          </button>
        </div>
      </form>
    )}

    {/* Not Verified Section */}
    {userData?.user?.govtIdStatus === "approved" ? (
      <div className="p-4 bg-gray-100 rounded-lg border border-[#A98E60]">
        <div className="flex items-center gap-3">
          <BadgeCheck className="text-green-500" size={24} />
          <p className="text-green-600 font-semibold">You are verified</p>
        </div>
        <p className="text-sm mt-2">Your identity has been successfully verified.</p>
      </div>
    ) : (
      <div className="p-4 bg-gray-100 rounded-lg border border-[#A98E60]">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-red-500" size={24} />
          <p className="text-red-600 font-semibold">You are not verified</p>
        </div>
        <p className="text-sm mt-2">Please upload a valid ID proof to verify your identity.</p>
        <div className="mt-3">
          <label className="flex items-center gap-2 cursor-pointer bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition">
            <UploadCloud size={20} />
            <span>Upload ID Proof</span>
            <input type="file" className="hidden" />
          </label>
        </div>
      </div>
    )}
  </div>
</div>


    </div>
    </OwnerLayout>
  );
}
