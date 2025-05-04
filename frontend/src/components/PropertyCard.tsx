
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';

interface PropertySearchProps {
  searchFilters: {
    location: string;
    type: string;
    bedrooms: string;
    priceRange: number[];
  };
  handleFilterChange: (key: string, value: any) => void;
  handleSearch: () => void;
}

const PropertySearch = ({ searchFilters, handleFilterChange, handleSearch }: PropertySearchProps) => {
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-grow">
            <Input 
              type="text" 
              placeholder="Search by city, neighborhood or address" 
              className="pl-10 py-6 text-base bg-gray-50 border-gray-200 rounded-xl focus:ring-golden focus:border-golden"
              value={searchFilters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            />
            <Search size={18} className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button 
              variant="outline" 
              className="border-golden text-golden hover:bg-golden hover:text-white flex-grow md:flex-grow-0"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} className="mr-2" />
              Filters
              <ChevronDown 
                size={16} 
                className={`ml-1 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} 
              />
            </Button>
            
            <Button 
              className="bg-golden hover:bg-golden-dark flex-grow md:flex-grow-0 text-white"
              onClick={handleSearch}
            >
              <Search size={18} className="mr-2" /> 
              Search
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <motion.div 
            className="mt-6 pt-6 border-t border-gray-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Property Type</label>
                <Select
                  value={searchFilters.type}
                  onValueChange={(value) => handleFilterChange("type", value)}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg">
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                <Select
                  value={searchFilters.bedrooms}
                  onValueChange={(value) => handleFilterChange("bedrooms", value)}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg">
                    <SelectValue placeholder="Any bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Price Range: ₹{searchFilters.priceRange[0]} - ₹{searchFilters.priceRange[1]}
                </label>
                <Slider
                  defaultValue={[0, 10000]}
                  min={0}
                  max={100000}
                  step={1000}
                  value={searchFilters.priceRange}
                  onValueChange={(value: number[]) => handleFilterChange("priceRange", value)}
                  className="mt-6"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button 
                variant="outline" 
                className="text-gray-500"
                onClick={() => setShowFilters(false)}
              >
                <X size={16} className="mr-2" /> Close
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PropertySearch;