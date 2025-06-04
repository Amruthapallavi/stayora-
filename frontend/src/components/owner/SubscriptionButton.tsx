import React from 'react';

interface SubscriptionButtonProps {
  planName: 'SILVER' | 'GOLD' | 'PLATINUM';
  price: number;
  allowedProperties: number;
  ownerId: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({ planName, price, allowedProperties, ownerId }) => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      return;
    }

    // Call your backend to create order
    const response = await fetch("http://localhost:3000/api/owner/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ planName, price, allowedProperties, ownerId })
    });

    const data = await response.json();
    const { id, amount, currency } = data;

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay key
      amount: amount.toString(),
      currency: currency,
      name: "Stayora",
      description: `${planName} Plan Subscription`,
      order_id: id,
      handler: async (response: any) => {
        const verifyRes = await fetch("http://localhost:3000/api/owner/verify-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            planName,
            ownerId,
            allowedProperties
          })
        });

        const result = await verifyRes.json();
        if (result.success) {
          alert("🎉 Subscription Activated Successfully!");
        } else {
          alert("❌ Payment verification failed.");
        }
      },
      prefill: {
        name: "Your User Name",
        email: "user@example.com"
      },
      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button onClick={handleSubscribe}>
      Subscribe to {planName} - ₹{price}
    </button>
  );
};

export default SubscriptionButton;
