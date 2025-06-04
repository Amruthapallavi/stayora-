import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PropertySearch from '../PropertySearch';

interface HeroSectionProps {
  searchFilters: {
    location: string;
    type: string;
    bedrooms: string;
    priceRange: [number, number];
  };
  handleFilterChange: (key: string, value: any) => void;
  handleSearch: () => void;
}

const HeroSection = ({ searchFilters, handleFilterChange, handleSearch }: HeroSectionProps) => {
    // const navigate=useNavigate();
  return (
    <section className="relative py-24 lg:py-36 overflow-hidden">
  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80')] bg-cover bg-center"></div>


      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Find Your Perfect Rental Home
          </motion.h1>
          
          <motion.p 
            className="text-xl text-white/90 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Discover premium rental properties tailored to your lifestyle and preferences
          </motion.p>
          
          <PropertySearch 
            searchFilters={searchFilters}
            handleFilterChange={handleFilterChange}
            handleSearch={handleSearch}
          />
        </div>
        
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <button
      onClick={() =>
        window.location.reload()
      }
      className="bg-white text-[#b68451] px-8 py-4 rounded-full font-medium inline-flex items-center shadow-lg hover:bg-gray-50 transition-all duration-300 group"
    >
      List All Properties
      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={18} />
    </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;