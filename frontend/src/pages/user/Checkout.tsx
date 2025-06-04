import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  User,
  Home,
  MoveRight,
  MapPin,
  Phone,
  Mail,
  Map,
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calendar";

import { format, addMonths } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

import { useAuthStore } from "../../stores/authStore";
import UserLayout from "../../components/user/UserLayout";
import { notifyError } from "../../utils/notifications";
import RazorpayPaymentButton from "../../components/RazorpayPayment";
import { IBooking } from "../../types/booking";
import { IService } from "../../types/service";

interface CheckoutProps {}

const CheckoutPage: React.FC<CheckoutProps> = () => {
  const {
    getCartDetails,
    saveBookingDates,
    saveAddOns,
    // clearCart,
    listServices,
  } = useAuthStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [moveInDate, setMoveInDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState<IService[]>([]);
  const [error, setError] = useState("");

  const steps = [
    { number: 1, label: "Rooms" },
    { number: 2, label: "Add-Ons" },
    { number: 3, label: "Payment" },
    { number: 4, label: "Complete" },
  ];

  const propertyId = searchParams.get("propertyId");
  const propertyName = searchParams.get("propertyName");
  const min = bookingDetails?.property?.minLeasePeriod;
  const max = bookingDetails?.property?.maxLeasePeriod;
  const [rentalPeriod, setRentalPeriod] = useState<number>(min);
  const [rentalPeriodError, setRentalPeriodError] = useState<string>("");
  const [bookingData, setBookingData] = useState<IBooking | null>(null);

  useEffect(() => {
    if (moveInDate && rentalPeriod) {
      const calculatedEndDate = addMonths(moveInDate, rentalPeriod);
      setEndDate(calculatedEndDate);
    }
  }, [moveInDate, rentalPeriod]);

  useEffect(() => {
    const loadCartData = async () => {
      if (!propertyId) return;
      const cartData = await getCartDetails(propertyId);
      if (cartData) {
        setBookingDetails(cartData);
        if (cartData.moveInDate) {
          setMoveInDate(new Date(cartData.moveInDate));
        }
        if (cartData.rentalPeriod) setRentalPeriod(cartData.rentalPeriod);
        if (cartData.endDate) {
          setEndDate(new Date(cartData.endDate));
        }
        if (cartData.selectedAddOns) setSelectedAddOns(cartData.selectedAddOns);
      }
    };

    loadCartData();
  }, [propertyId]);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await listServices();
        setServices(response.services);
      } catch (error) {
        console.error("Failed to fetch services", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);
  useEffect(() => {
    const completed = localStorage.getItem("bookingCompleted") === "true";

    if (completed) {
      localStorage.removeItem("bookingCompleted");
      setCurrentStep(4);
    } else {
      setCurrentStep(1);
    }
  }, []);

  const handleStepChange = async (step: number) => {
    if (currentStep === 4) return;

    if (step >= 1 && step <= 4) {
      if (currentStep === 1 && step > currentStep) {
        setIsLoading(true);
        if (moveInDate && endDate) {
          try {
            if (propertyId) {
              await saveBookingDates(
                moveInDate,
                rentalPeriod,
                endDate,
                propertyId
              );
            } else {
              console.error("propertyId is null or undefined");
            }
          } catch (error) {
            setIsLoading(false);
            console.error("Failed to save booking dates", error);
            return;
          }
        } else {
          const errMsg = "Missing move-in date or end date";
          setError(errMsg);

          notifyError(errMsg);
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
      }

      if (currentStep === 2 && step > currentStep) {
        setIsLoading(true);

        try {
          if (propertyId !== null) {
            await saveAddOns(selectedAddOns, propertyId);
          } else {
            console.error("propertyId is null");
          }
        } catch (error) {
          setIsLoading(false);
          console.error("Failed to save add-ons", error);
          return;
        }
        setIsLoading(false);
      }

      setCurrentStep(step);
    }
  };

  const handleRoomSelect = () => {
    if (currentStep === 4) return;
    setSelectedRoom(bookingDetails?.property);
    handleStepChange(2);
  };

  const handleAddOnToggle = (serviceId: string) => {
    if (currentStep === 4) return;

    if (selectedAddOns.includes(serviceId)) {
      setSelectedAddOns(selectedAddOns.filter((id) => id !== serviceId));
    } else {
      setSelectedAddOns([...selectedAddOns, serviceId]);
    }
  };

  const calculateTotalPrice = () => {
    if (!rentalPeriod) return 0;

    const monthlyRate = bookingDetails?.property?.rentPerMonth || 0;

    const addOnTotal = selectedAddOns.reduce((total, addOnId) => {
      const matchedService = services.find(
        (service) => service._id === addOnId
      );
      return total + (matchedService?.price || 0);
    }, 0);

    const total = monthlyRate * rentalPeriod + addOnTotal;

    return total;
  };
  const getAmountInPaise = () => {
    return Math.round(calculateTotalPrice() * 100);
  };

  const handleCompleteBooking = async (booking: IBooking) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setBookingData(booking);
      localStorage.setItem("bookingCompleted", "true");
      setIsLoading(false);
      handleStepChange(4);
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to complete booking");
    }
  };

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Checkout Steps */}
          <div className="mb-12 relative">
            <div className="flex justify-between items-center mb-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center relative z-10"
                  onClick={() => handleStepChange(step.number)}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${
                      currentStep === step.number
                        ? "bg-[#b38e5d] text-white"
                        : currentStep > step.number
                        ? "bg-[#d8c3a5] text-white"
                        : "bg-white border border-gray-200 text-gray-500"
                    }`}
                  >
                    {step.number}
                  </div>
                  <span className="mt-2 text-sm text-gray-600">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute top-6 left-0 right-0 h-[1px] bg-gray-200 -z-0"></div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                {/* Move-in Date and Rental Period Selection - Now in one line */}

                <div className="flex flex-col space-y-6 mb-8">
                  <div className="flex flex-wrap md:flex-nowrap gap-4">
                    <div className="w-full md:w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Move-in Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="flex items-center w-full px-4 py-2 border border-[#d1d5db] rounded-md bg-[#ffffff] text-left focus:outline-none focus:ring-2 focus:ring-[#b38e5d] focus:border-[#b38e5d]">
                            <CalendarIcon className="mr-2 h-4 w-4 text-[#b38e5d]" />
                            <span className="flex-1">
                              {moveInDate
                                ? format(moveInDate, "MMMM d, yyyy")
                                : "Select move-in date"}
                            </span>
                          </button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={moveInDate}
                            onSelect={(date) => setMoveInDate(date)}
                            disabled={(date) =>
                              date < new Date() || currentStep === 4
                            } 
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="w-full md:w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rental Period (months)
                      </label>
                      <input
                        type="number"
                        disabled={currentStep === 4}
                        min={min}
                        max={max}
                        value={rentalPeriod}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value < min || value > max) {
                            setRentalPeriodError(
                              `Rental period must be between ${min} and ${max} months`
                            );
                          } else {
                            setRentalPeriodError("");
                            setRentalPeriod(value);
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b38e5d] focus:border-[#b38e5d]"
                        placeholder={`Enter months (${min}-${max})`}
                      />
                      {rentalPeriodError && (
                        <p className="text-red-600 text-sm mt-1">
                          {rentalPeriodError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {/* Content based on current step */}
                {currentStep === 1 && (
                  <div className="border rounded-lg overflow-hidden">
                    {/* <h1>{bookingDetails?.property?.title}</h1> */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                      <div className="md:col-span-1">
                        <img
                          src={bookingDetails?.property?.images[0]}
                          alt={bookingDetails?.property?.title}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <h2>{bookingDetails?.property?.title}</h2>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                          {bookingDetails?.property?.name}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                          <div className="flex items-center gap-2">
                            <Home className="text-[#b38e5d]" size={16} />
                            <span className="text-sm text-gray-600">
                              Bedrooms: {bookingDetails?.property?.bedrooms}
                            </span>
                            <span className="text-sm text-gray-600">
                              Bathrooms: {bookingDetails?.property?.bathrooms}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Map className="text-[#b38e5d]" size={16} />
                            <span className="text-sm text-gray-600">
                              Type: {bookingDetails?.property?.type}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MoveRight className="text-[#b38e5d]" size={16} />
                            <span className="text-sm text-gray-600">
                              Location : {bookingDetails?.property?.city}{" "}
                              {bookingDetails?.property?.district}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center border-t pt-4 mt-4">
                          <div>
                            <p className="text-lg font-bold text-gray-900">
                              Monthly Rate
                            </p>
                            <p className="text-gray-600 text-sm">
                              {bookingDetails?.property?.rentPerMonth}
                            </p>
                          </div>
                          <button
                            onClick={handleRoomSelect}
                            className="bg-[#b38e5d] text-white px-6 py-2 rounded-md hover:bg-[#8b6b3b] transition-colors"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border-t">
                      <p className="text-gray-600 text-sm">
                        {bookingDetails?.property?.description}
                      </p>
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="border rounded-lg overflow-hidden p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">
                      Choose Add-Ons
                    </h3>

                    <div className="space-y-4">
                      {services.length > 0 ? (
                        services.map((service: any) => (
                          <div
                            key={service._id}
                            className={`p-4 border rounded-md cursor-pointer transition-all ${
                              selectedAddOns.includes(service._id)
                                ? "border-[#b38e5d] bg-[#f8f5f0]"
                                : "hover:border-gray-300"
                            }`}
                            onClick={() => handleAddOnToggle(service._id)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium text-gray-800">
                                  {service.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {service.description ||
                                    "Enhance your stay with this service"}
                                </p>
                              </div>
                              <div className="text-lg font-semibold text-[#b38e5d]">
                                +₹
                                {service.price?.toLocaleString("en-IN") ||
                                  "100"}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No services available.</p>
                      )}
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button
                        onClick={() => handleStepChange(1)}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        disabled={isLoading}
                      >
                        Back
                      </button>
                      <button
                        onClick={() => handleStepChange(3)}
                        className="bg-[#b38e5d] text-white px-6 py-2 rounded-md hover:bg-[#8b6b3b] transition-colors"
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Continue to Payment"}
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="border rounded-lg overflow-hidden p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">
                      Payment Details
                    </h3>

                    <Tabs defaultValue="credit-card" className="w-full">
                      <TabsList className="grid grid-cols-3 mb-6">
                        <TabsTrigger value="credit-card">
                          Credit Card
                        </TabsTrigger>
                        <TabsTrigger value="razorpay">RazorPay</TabsTrigger>
                        <TabsTrigger value="bank-transfer">
                          Bank Transfer
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="credit-card" className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Expiration Date
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CVC
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="razorpay">
                        <div className="text-center py-10">
                          <p className="mb-4 text-gray-600">
                            Click below to pay securely with Razorpay
                          </p>
                          <RazorpayPaymentButton
                            amount={getAmountInPaise()}
                            productId={bookingDetails?.property._id}
                            onSuccess={handleCompleteBooking}
                            onFailure={() => setCurrentStep(6)} 
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="bank-transfer">
                        <div className="space-y-2 py-4">
                          <p className="text-gray-700">
                            Bank: First National Bank
                          </p>
                          <p className="text-gray-700">
                            Account Name: Luxury Rentals Inc
                          </p>
                          <p className="text-gray-700">
                            Account Number: 1234567890
                          </p>
                          <p className="text-gray-700">Sort Code: 12-34-56</p>
                          <p className="text-gray-700">
                            Reference: Your reservation number
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="mt-8 flex justify-between">
                      <button
                        onClick={() => handleStepChange(2)}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        disabled={isLoading}
                      >
                        Back
                      </button>
                      <button
                        onClick={() => handleCompleteBooking}
                        className="bg-[#b38e5d] text-white px-6 py-2 rounded-md hover:bg-[#8b6b3b] transition-colors"
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Complete Booking"}
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="border rounded-lg overflow-hidden p-6 text-center">
                    <div className="mb-6">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                        Booking Confirmed!
                      </h3>
                      <p className="text-gray-600">
                        Your reservation has been completed successfully.
                      </p>
                    </div>

                    <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-md mb-6">
                      <div className="text-left space-y-2">
                        <p className="flex justify-between">
                          <span className="text-gray-600">
                            Booking Reference:
                          </span>
                          <span className="font-medium">
                            {bookingData?.bookingId}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-600">Move-in Date:</span>
                          <span className="font-medium">
                            {moveInDate
                              ? format(moveInDate, "MMM d, yyyy")
                              : "-"}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-600">End Date:</span>
                          <span className="font-medium">
                            {endDate ? format(endDate, "MMM d, yyyy") : "-"}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-medium">
                            {bookingData?.totalCost}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center gap-4">
                      <Link
                        to="/user/bookings"
                        className="px-6 py-2 border border-[#b38e5d] rounded-md text-[#b38e5d] hover:bg-[#f8f5f0]"
                      >
                        View Booking
                      </Link>
                      <Link
                        to="/user/home"
                        className="bg-[#b38e5d] text-white px-6 py-2 rounded-md hover:bg-[#8b6b3b] transition-colors"
                      >
                        Return Home
                      </Link>
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="border rounded-lg overflow-hidden p-6 text-center">
                    <div className="mb-6">
                      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-red-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                        Booking Failed
                      </h3>
                      <p className="text-gray-600">
                        Your payment was not completed. Please try again.
                      </p>
                    </div>

                    <div className="flex justify-center gap-4">
                      <Link
                        to={`/user/property/${propertyId}`}
                        className="bg-[#b38e5d] text-white px-6 py-2 rounded-md hover:bg-[#8b6b3b] transition-colors"
                      >
                        Try Again
                      </Link>

                      <Link
                        to="/user/home"
                        className="bg-[#b38e5d] text-white px-6 py-2 rounded-md hover:bg-[#8b6b3b] transition-colors"
                      >
                        Return Home
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stay Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Your Stay
                </h3>
                <div className="w-12 h-1 bg-[#b38e5d] mb-6"></div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Move-in Date:</p>
                    <p className="font-medium">
                      {moveInDate
                        ? format(moveInDate, "MMMM d, yyyy")
                        : "Please select"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm mb-1">Rental Period:</p>
                    <p className="font-medium">
                      {rentalPeriod} {rentalPeriod === 1 ? "month" : "months"}
                    </p>
                  </div>

                  {endDate && (
                    <div>
                      <p className="text-gray-600 text-sm mb-1">End Date:</p>
                      <p className="font-medium">
                        {format(endDate, "MMMM d, yyyy")}
                      </p>
                    </div>
                  )}

                  <p className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span>{bookingDetails?.property?.type}</span>
                  </p>
                </div>

                {selectedRoom && (
                  <div className="border-t border-b py-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">
                        {bookingDetails?.property?.title}
                      </span>
                      <span>
                        {bookingDetails?.property?.rentPerMonth}/month
                      </span>
                    </div>

                    {selectedAddOns.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <p className="text-sm text-gray-600">Add-ons:</p>
                        {selectedAddOns.map((addonId) => {
                          const addon = services.find(
                            (service) => service._id === addonId
                          );
                          return addon ? (
                            <div
                              key={addonId}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-gray-800">
                                {addon.name}
                              </span>
                              <span className="text-[#b38e5d] font-semibold">
                                ₹{addon.price?.toLocaleString("en-IN") || "100"}
                              </span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span>{calculateTotalPrice()}</span>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between gap-4">
                    <Link
                      to="/user/home"
                      className="w-1/2 text-center px-4 py-2 border border-[#b38e5d] rounded-md text-[#b38e5d] hover:bg-[#f8f5f0] transition-colors"
                    >
                      Home
                    </Link>
                    <Link
                      to="/user/bookings"
                      className="w-1/2 text-center bg-[#b38e5d] text-white px-4 py-2 rounded-md hover:bg-[#8b6b3b] transition-colors"
                    >
                      My Bookings
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Need Assistance?
                </h3>
                <div className="w-12 h-1 bg-[#b38e5d] mb-6"></div>

                <p className="text-gray-600 mb-6">
                  Our dedicated reservations team is ready to help you around
                  the clock.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-[#b38e5d]" size={20} />
                    <span>55 Columbus Circle, New York, NY</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="text-[#b38e5d]" size={20} />
                    <span>1111-2222-3333</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="text-[#b38e5d]" size={20} />
                    <span>hello@quitenicestuff.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default CheckoutPage;
