import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-golden/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Ready to find your dream property?</h3>
            <p className="text-gray-600">Browse our extensive collection of premium rental properties today.</p>
          </div>
          <Link 
            to="/user/properties" 
            className="bg-[#b68451] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#b68451] transition-colors inline-flex items-center"
          >
            Explore Properties
            <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
