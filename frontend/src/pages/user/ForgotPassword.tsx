import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { notifySuccess, notifyError } from "../../utils/notifications";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [error,setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const {ForgotPassword} = useAuthStore();
    const handleSubmit = async (e:any) => {
        e.preventDefault();

        if (!email.trim()) {
            alert('Please enter a valid email address.');
            return;
        }

        try {
            await ForgotPassword(email, "user");
             notifySuccess("Login successful!");
                  navigate("/user/home");

                } catch (err: any) {
                    const errMsg =
                      err.response?.data?.message || "Failed to login. Please try again.";
                    setError(errMsg);
                    notifyError(errMsg);
                  } finally {
                    setIsLoading(false);
                  }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">Enter your email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
                    >
                        Send OTP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
