import { loadRazorpayScript } from "../utils/loadRazorpayScript";
import { useAuthStore } from "../stores/authStore";
import { RazorpayOptions } from "./hooks/RazorPay";
import { RazorpayOrderResponse, RazorpayPaymentButtonProps, RazorpayResponse } from "../types/razorPay";


const RazorpayPaymentButton: React.FC<RazorpayPaymentButtonProps> = ({ amount, productId, onSuccess, onFailure }) => {
  const createRazorpayOrder = useAuthStore((state) => state.createRazorpayOrder);
  const verifyRazorpayOrder = useAuthStore((state) => state.verifyRazorpayOrder);
  const {user}= useAuthStore();
  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Failed to load Razorpay SDK. Please check your connection.");
      return;
    }

    try {
      const order: RazorpayOrderResponse = await createRazorpayOrder(amount,productId);
      console.log("Created Razorpay Order:", order); 

      if (!order?.id) {
        alert("Failed to create Razorpay order.");
        return;
      }

      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY || process.env.REACT_APP_RAZORPAY_KEY || "",
        amount: order.amount,
        currency: "INR",
        name: "StayOra",
        description: "Booking Payment",
        order_id: order.id,
        handler: async (response: RazorpayResponse) => {
          const verification = await verifyRazorpayOrder({
            ...response,
            bookingId: order.bookingId,
          });
          if (verification?.success && verification?.booking) {
            onSuccess(verification.booking);
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#b38e5d",
        },
        modal: {
          ondismiss: () => {
            console.log("Payment cancelled by user.");
            onFailure(); // Call failure callback
          },
        },
      };
      

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay Error:", error);
      alert("Something went wrong with Razorpay.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-[#b38e5d] text-white px-6 py-2 rounded-md hover:bg-[#8b6b3b] transition-colors"
    >
      Pay ₹{amount / 100} with Razorpay
    </button>
  );
};

export default RazorpayPaymentButton;
