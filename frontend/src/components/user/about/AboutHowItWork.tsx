import { Search, Calendar, Key, PlusCircle, Camera, DollarSign } from "lucide-react";

const AboutHowItWorks = () => {
  return (
    <section className="py-20 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">
            How StayOra Works
          </h2>
          <p className="text-xl text-amber-700">
            Simple steps to start your journey with StayOra
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* For Travelers */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-amber-800 mb-8 text-center">
              For Travelers
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Search & Discover</h4>
                  <p className="text-amber-700">Browse stylish rental properties in any location using our smart search filters</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Book Instantly</h4>
                  <p className="text-amber-700">Make secure reservations with instant confirmation and flexible dates</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Enjoy Your Stay</h4>
                  <p className="text-amber-700">Check-in to your stylish accommodation and create unforgettable memories</p>
                </div>
              </div>
            </div>
          </div>

          {/* For Property Owners */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-amber-800 mb-8 text-center">
              For Property Owners
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Register as Owner</h4>
                  <p className="text-amber-700">Click "Grow Your Business" to register or login as an existing owner</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Add Your Properties</h4>
                  <p className="text-amber-700">Create stunning listings with photos and detailed descriptions of your rental properties</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Start Earning</h4>
                  <p className="text-amber-700">Receive bookings and payments securely while growing your rental business</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHowItWorks;
