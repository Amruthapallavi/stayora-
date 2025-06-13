import { useState } from "react";
import { BadgeDollarSign, Star, StarOff, WalletCards, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";

const plans = [
  {
    key: 'silver',
    planName: 'SILVER',
    price: 1999,
    allowedProperties: 3,
    features: [
      { label: "List up to 3 properties", included: true },
      { label: "Basic analytics", included: true },
      { label: "No featured listings", included: false },
      { label: "Standard commission (10%)", included: false },
    ],
    icon: <StarOff className="h-6 w-6 text-[#A98E60]" />,
  },
  {
    key: 'gold',
    planName: 'GOLD',
    price: 5999,
    allowedProperties: 10,
    features: [
      { label: "List up to 10 properties", included: true },
      { label: "Advanced analytics", included: true },
      { label: "Featured listings", included: true },
      { label: "Reduced commission (7%)", included: true },
    ],
    icon: <Star className="h-6 w-6 text-[#A98E60]" />,
    highlight: true,
  },
  {
    key: 'platinum',
    planName: 'PLATINUM',
    price: 10999,
    allowedProperties: 25,
    features: [
      { label: "Unlimited property listings", included: true },
      { label: "Premium analytics & reporting", included: true },
      { label: "Priority featured listings", included: true },
      { label: "Lowest commission (5%)", included: true },
    ],
    icon: <WalletCards className="h-6 w-6 text-[#A98E60]" />,
  }
];

const Subscribe = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { subscribe,verifySubscription } = useAuthStore();

 const handleSubscribe = async (planName: string, price: number, allowedProperties: number) => {
  try {
    const data = await subscribe(planName, price, allowedProperties);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.amount,
      currency: "INR",
      name: "stayOra",
      description: `${planName} Plan Subscription`,
      image: "/logo.png",
      order_id: data.id,
      handler: async function (response: any) {

        const verifyPayload = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          planName,
          price,
          allowedProperties,
        };

        const verify = await verifySubscription(verifyPayload);
        if (verify.success) {
          notifySuccess("Subscribed successfully!");

          setTimeout(() => {
            window.location.href = "/owner/dashboard";
          }, 1000); 
        } else {
          notifyError("Payment verification failed.");
        }
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9876543210",
      },
      notes: {
        planName,
      },
      theme: {
        color: "#A98E60",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (err) {
    toast.error("Failed to start payment");
  }
};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FCF8F3] to-white py-16 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <span className="inline-block text-sm font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-800 mb-4">Premium Plans</span>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            Choose Your <span className="text-[#A98E60]">Subscription</span>
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
            Unlock premium features and elevate your property management.
          </p>
        </motion.div>

        <motion.div className="grid md:grid-cols-3 gap-8 mt-16" variants={containerVariants}>
          {plans.map((plan) => (
            <motion.div key={plan.key} variants={itemVariants}>
              <Card
                className={`relative overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl ${
                  selectedPlan === plan.key ? 'ring-2 ring-[#A98E60] scale-105' : plan.highlight ? 'ring-2 ring-amber-200' : ''
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 right-0 bg-[#A98E60] text-white px-3 py-1 text-xs font-medium animate-pulse">
                    POPULAR
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="p-2 bg-amber-50 rounded-lg">{plan.icon}</div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-3xl font-bold text-gray-900">
                        ₹{plan.price}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-4">{plan.planName}</h3>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className={`flex items-center text-sm ${f.included ? "text-gray-800" : "text-gray-500"}`}>
                        {f.included ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        )}
                        <span>{f.label}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full transition-transform transform hover:scale-105 ${
                      selectedPlan === plan.key
                        ? "bg-gray-200 text-gray-800"
                        : "bg-gradient-to-r from-[#A98E60] to-amber-500 text-white hover:from-amber-600 hover:to-amber-500"
                    }`}
                    onClick={() => {
                      setSelectedPlan(plan.key);
                      handleSubscribe(plan.planName, plan.price,plan.allowedProperties);
                    }}
                  >
                    {selectedPlan === plan.key ? (
                      "Current Plan"
                    ) : (
                      <>
                        <BadgeDollarSign className="mr-2 h-4 w-4" />
                        Subscribe Now
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="mt-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-10 rounded-2xl shadow-md">
            <h3 className="text-2xl font-semibold mb-6 text-center text-[#8A7242]">Why Go Premium?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-white p-4 rounded-full shadow mb-3">
                  <BadgeDollarSign className="h-8 w-8 text-[#A98E60]" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Lower Commissions</h4>
                <p className="text-sm text-gray-600">Keep more of your revenue with reduced platform fees.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-white p-4 rounded-full shadow mb-3">
                  <Star className="h-8 w-8 text-[#A98E60]" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Priority Listings</h4>
                <p className="text-sm text-gray-600">Appear first in search results and attract more tenants.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-white p-4 rounded-full shadow mb-3">
                  <WalletCards className="h-8 w-8 text-[#A98E60]" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">Advanced Tools</h4>
                <p className="text-sm text-gray-600">Get access to analytics, reports, and performance metrics.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Subscribe;
