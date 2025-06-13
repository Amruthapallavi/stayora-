
import { Button } from "../../ui/button";
import {  TrendingUp, Search } from "lucide-react";

const AboutCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r bg-yellow-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Start Your StayOra Journey?
        </h2>
        <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
          Join thousands of travelers discovering amazing properties and property owners earning extra income through StayOra.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-amber-700 hover:bg-gray-100 shadow-lg">
            <Search className="w-5 h-5 mr-2" />
            Book Your Stay
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-700 shadow-lg">
            <TrendingUp className="w-5 h-5 mr-2" />
            Grow Your Business
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutCTA;
