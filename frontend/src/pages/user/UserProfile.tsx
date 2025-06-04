import { useEffect, useState } from "react";
import { User, Key, Phone, MapPin, Calendar } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import { useAuthStore } from "../../stores/authStore";
import UserLayout from "../../components/user/UserLayout";
import { IUser } from "../../types/user";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { validateEmail } from "../../utils/validators";
import * as moment from "moment";

const Profile = () => {
  const { user, getUserData, updateUser, changePassword } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  const [profileForm, setProfileForm] = useState<Partial<IUser>>({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: {
      houseNo: "",
      street: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
    },
  });
  const [userData, setUserData] = useState<IUser | null>(null);
  const [showAddressFields, setShowAddressFields] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.id) {
        const data = await getUserData(user.id, "user");
        setUserData(data?.user);
      }
    };
    fetchUserData();
  }, [user]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  useEffect(() => {
    if (userData) {
      setProfileForm({
        id: userData.id || "",
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: {
          houseNo: userData.address?.houseNo || "",
          street: userData.address?.street || "",
          city: userData.address?.city || "",
          district: userData.address?.district || "",
          state: userData.address?.state || "",
          pincode: userData.address?.pincode || "",
        },
      });
    }
  }, [userData]);

  const handleToggleAddressFields = () => {
    setShowAddressFields(true);
  };
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1] as keyof IUser;

      setProfileForm((prevForm) => ({
        ...prevForm,
        address: {
          ...prevForm.address,
          [field]: value,
        },
      }));
    } else {
      setProfileForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, phone } = profileForm;

    if (!name || !name.trim()) {
      notifyError("Invalid Name... Name cannot be empty or spaces only");
      return;
    }

    if (!email) {
      notifyError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      notifyError("Invalid Email... Please enter a valid email address");
      return;
    }

    if (!phone) {
      notifyError("Phone number is required");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.trim())) {
      notifyError("Phone number must be exactly 10 digits");
      return;
    }

    try {
      await updateUser(user.id, profileForm);
      notifySuccess("Profile updated Successfully");
      if (userData) {
        setProfileForm(userData);
      }
      window.location.reload();
    } catch (error) {
      console.error("Profile update failed", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (
      !currentPassword.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      notifyError("Fields cannot contain only spaces!");
      return;
    }

    if (newPassword !== confirmPassword) {
      notifyError("Passwords do not match!");
      return;
    }

    if (newPassword.length < 4) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }
    try {
      await changePassword({
        userId: user.id,
        oldPass: currentPassword,
        newPass: newPassword,
      });

      notifySuccess("password successfully updated");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      console.log(err.response.data, "error");
      notifyError(err.response.data.message);
      // toast.error(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-[#b38e5d] flex items-center justify-center text-white text-2xl font-bold mb-4">
                      {userData?.name.charAt(0)}
                    </div>
                    <h3 className="text-xl font-semibold">{userData?.name}</h3>
                    <p className="text-gray-500">{userData?.email}</p>

                    <div className="w-full border-t my-6"></div>

                    <div className="w-full space-y-2">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Phone size={18} />
                        <span>{userData?.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        {(userData?.address?.city ||
                          userData?.address?.district ||
                          userData?.address?.state ||
                          userData?.address?.pincode) && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <MapPin size={18} />
                            <span>
                              {[
                                userData?.address?.city,
                                userData?.address?.district,
                                userData?.address?.state,
                                userData?.address?.pincode,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar size={18} />

                        {userData && (
                          <p className="text-sm text-gray-500">
                            Joined on:{" "}
                            {moment
                              .default(userData.createdAt)
                              .format("D MMM YYYY")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs
                defaultValue="profile"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-8">
                  <TabsTrigger
                    value="profile"
                    className="flex items-center gap-2"
                  >
                    <User size={16} />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="password"
                    className="flex items-center gap-2"
                  >
                    <Key size={16} />
                    Security
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Profile</CardTitle>
                      <CardDescription>
                        Update your personal information
                      </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleProfileSubmit}>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Full Name
                            </label>
                            <Input
                              id="name"
                              name="name"
                              value={profileForm.name}
                              onChange={handleProfileChange}
                              placeholder="Your full name"
                            />
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Email
                            </label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={profileForm.email}
                              onChange={handleProfileChange}
                              placeholder="Your email address"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="phone"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Phone Number
                            </label>
                            <Input
                              id="phone"
                              name="phone"
                              value={profileForm.phone}
                              onChange={handleProfileChange}
                              placeholder="Your phone number"
                            />
                          </div>

                          <div className="space-y-2">
                            {!showAddressFields ? (
                              <Button
                                type="button"
                                onClick={handleToggleAddressFields}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 mt-7"
                              >
                                Add Address
                              </Button>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label
                                    htmlFor="houseNo"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    House No
                                  </label>
                                  <Input
                                    id="houseNo"
                                    name="address.houseNo"
                                    value={profileForm?.address?.houseNo || ""}
                                    onChange={handleProfileChange}
                                    placeholder="House number"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor="street"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Street
                                  </label>
                                  <Input
                                    id="street"
                                    name="address.street"
                                    value={profileForm?.address?.street || ""}
                                    onChange={handleProfileChange}
                                    placeholder="Street name"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor="city"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    City
                                  </label>
                                  <Input
                                    id="city"
                                    name="address.city"
                                    value={profileForm?.address?.city || ""}
                                    onChange={handleProfileChange}
                                    placeholder="City"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor="district"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    District
                                  </label>
                                  <Input
                                    id="district"
                                    name="address.district"
                                    value={profileForm?.address?.district || ""}
                                    onChange={handleProfileChange}
                                    placeholder="District"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor="state"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    State
                                  </label>
                                  <Input
                                    id="state"
                                    name="address.state"
                                    value={profileForm?.address?.state || ""}
                                    onChange={handleProfileChange}
                                    placeholder="State"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor="pincode"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Pincode
                                  </label>
                                  <Input
                                    id="pincode"
                                    name="address.pincode"
                                    value={profileForm?.address?.pincode || ""}
                                    onChange={handleProfileChange}
                                    placeholder="Pincode"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        {/*                       
                      <div className="space-y-2">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                        <Textarea 
                          id="bio"
                          name="bio"
                          value={userData?.bio}
                          onChange={handleProfileChange}
                          placeholder="Tell us about yourself"
                          rows={4}
                        />
                      </div> */}
                      </CardContent>

                      <CardFooter className="flex justify-end">
                        <Button
                          type="submit"
                          className="bg-[#b38e5d] hover:bg-[#8b6b3b]"
                        >
                          Save Changes
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>

                <TabsContent value="password">
                  <Card>
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>
                        Update your password to keep your account secure
                      </CardDescription>
                    </CardHeader>
                    <form onSubmit={handlePasswordSubmit}>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label
                              htmlFor="currentPassword"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Current Password
                            </label>
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type="password"
                              value={passwordForm.currentPassword}
                              onChange={handlePasswordChange}
                              placeholder="Enter your current password"
                            />
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="newPassword"
                              className="block text-sm font-medium text-gray-700"
                            >
                              New Password
                            </label>
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              value={passwordForm.newPassword}
                              onChange={handlePasswordChange}
                              placeholder="Enter your new password"
                            />
                            <p className="text-xs text-gray-500">
                              Password must be at least 8 characters long
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="confirmPassword"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Confirm Password
                            </label>
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              value={passwordForm.confirmPassword}
                              onChange={handlePasswordChange}
                              placeholder="Confirm your new password"
                            />
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="flex justify-end">
                        <Button
                          type="submit"
                          className="bg-[#b38e5d] hover:bg-[#8b6b3b]"
                          disabled={
                            !passwordForm.currentPassword.trim() ||
                            !passwordForm.newPassword.trim() ||
                            !passwordForm.confirmPassword.trim()
                          }
                        >
                          Update Password
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Profile;
