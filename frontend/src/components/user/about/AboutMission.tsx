import { CheckCircle, Star } from "lucide-react";

const AboutMission = () => {
  return (
    <section className="py-20 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-left">
            <h2 className="text-4xl font-bold text-amber-900 mb-6">
              Your Gateway to Exceptional Stays
            </h2>
            <p className="text-lg text-amber-800 mb-6">
              StayOra connects users like you with stunning rental properties across the globe. Whether you're planning to relocate somewhere else, or extended vacation, we make it easy to find and book the perfect house for you.
            </p>
            <p className="text-lg text-amber-700 mb-8">
              Want to earn extra income? Register as a property owner by clicking "Grow Your Business" or login as an existing owner to add your properties to our platform and start earning today.
            </p>
            <div className="flex items-center space-x-4">
              <CheckCircle className="w-6 h-6 text-amber-600" />
              <span className="text-amber-800">Trusted by thousands of travelers worldwide</span>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=600&h=400&fit=crop" 
              alt="Beautiful vacation rental" 
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-semibold">4.9/5</span>
              </div>
              <p className="text-sm opacity-90">Guest satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMission;
