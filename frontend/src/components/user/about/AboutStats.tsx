import { Users, MapPin, Star, Calendar } from "lucide-react";

const AboutStats = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-[#b68451] to-[#fef3c7] text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-fade-in">
            <div className="text-4xl font-bold mb-2">10K+</div>
            <div className="flex items-center justify-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Happy Guests</span>
            </div>
          </div>
          <div className="animate-fade-in">
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Cities</span>
            </div>
          </div>
          <div className="animate-fade-in">
            <div className="text-4xl font-bold mb-2">4.9</div>
            <div className="flex items-center justify-center space-x-2">
              <Star className="w-5 h-5" />
              <span>Rating</span>
            </div>
          </div>
          <div className="animate-fade-in">
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStats;
