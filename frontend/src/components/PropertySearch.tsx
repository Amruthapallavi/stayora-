import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { useAuthStore } from '../stores/authStore';

interface PropertySearchProps {
  searchFilters: {
    location: string;
    type: string;
    bedrooms: string;
    priceRange: number[];
    features?: string[];
  };
  handleFilterChange: (key: string, value: any) => void;
  handleSearch: () => void;
}

const PropertySearch = ({
  searchFilters,
  handleFilterChange,
  handleSearch,
}: PropertySearchProps) => {
  const { listAllFeatures } = useAuthStore();
  const [showFilters, setShowFilters] = useState(false);
  const [allAmenities, setAllAmenities] = useState<any[]>([]);
  const [showAmenities, setShowAmenities] = useState(false);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await listAllFeatures();
        setAllAmenities(response);
      } catch (error) {
        console.error('Failed to fetch amenities:', error);
      }
    };
    fetchAmenities();
  }, []);

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-md overflow-hidden w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="p-8">
        {/* Search + buttons */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search by city, neighborhood or address"
              className="pl-14 py-3 text-sm bg-gray-100 border border-gray-200 rounded-xl focus:ring-0 focus:border-[#c9a46c]"
              value={searchFilters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              spellCheck={false}
              autoComplete="off"
            />
            <Search
              size={22}
              className="text-gray-400 absolute left-5 top-1/2 transform -translate-y-1/2"
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <Button
              variant="outline"
              className="border-[#c9a46c] text-[#c9a46c] hover:bg-[#f9f2de] hover:text-[#a17d3a] rounded-full px-7 py-2 text-sm font-medium shadow-sm transition-colors duration-200"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} className="inline-block mr-2" />
              Filters
              <ChevronDown
                size={18}
                className={`inline-block ml-1 transition-transform duration-300 ${
                  showFilters ? 'rotate-180' : ''
                }`}
              />
            </Button>

            <Button
              className="bg-gradient-to-r from-[#c9a46c] to-[#a17d3a] hover:from-[#b9983c] hover:to-[#8c6c1f] text-white rounded-full px-9 py-2 text-sm font-semibold shadow-md transition-all duration-300"
              onClick={handleSearch}
            >
              <Search size={20} className="inline-block mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="mt-8 pt-8 border-t border-gray-300"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Property Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 tracking-wide">
                    Property Type
                  </label>
                  <Select
                    value={searchFilters.type}
                    onValueChange={(value) => handleFilterChange('type', value)}
                  >
                    <SelectTrigger className="bg-gray-100 border border-gray-300 rounded-lg py-2.5 text-sm text-gray-700">
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

                {/* Bedrooms */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 tracking-wide">
                    Bedrooms
                  </label>
                  <Select
                    value={searchFilters.bedrooms}
                    onValueChange={(value) =>
                      handleFilterChange('bedrooms', value)
                    }
                  >
                    <SelectTrigger className="bg-gray-100 border border-gray-300 rounded-lg py-2.5 text-sm text-gray-700">
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

                {/* Price Range */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 tracking-wide">
                    Price Range: ₹{searchFilters.priceRange[0]} - ₹
                    {searchFilters.priceRange[1]}
                  </label>
                  <Slider
                    defaultValue={[0, 10000]}
                    min={0}
                    max={100000}
                    step={1000}
                    value={searchFilters.priceRange}
                    onValueChange={(value: number[]) =>
                      handleFilterChange('priceRange', value)
                    }
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Amenities toggle */}
              <div className="mt-10">
                <button
                  className="inline-flex items-center gap-2 text-[#a17d3a] font-semibold text-sm tracking-wide hover:text-[#7d6425] transition-colors"
                  onClick={() => setShowAmenities(!showAmenities)}
                >
                  {showAmenities ? (
                    <>
                      Hide Amenities <ChevronUp size={18} />
                    </>
                  ) : (
                    <>
                      Show Amenities <ChevronDown size={18} />
                    </>
                  )}
                </button>

                {/* Amenities chips */}
                <AnimatePresence>
                  {showAmenities && allAmenities.length > 0 && (
                    <motion.div
                      className="mt-5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-44 overflow-y-auto"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {allAmenities.map((amenity) => {
                        const selected =
                          searchFilters.features?.includes(amenity.name);
                        return (
                          <label
                            key={amenity._id}
                            className={`cursor-pointer select-none text-xs font-medium rounded-full px-3 py-1.5 border transition-colors duration-200 ${
                              selected
                                ? 'bg-gradient-to-r from-[#c9a46c] to-[#a17d3a] text-white border-transparent shadow-md'
                                : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={selected}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const currentFeatures =
                                  searchFilters.features || [];

                                const updatedFeatures = isChecked
                                  ? [...currentFeatures, amenity.name]
                                  : currentFeatures.filter((f) => f !== amenity.name);

                                handleFilterChange('features', updatedFeatures);
                              }}
                            />
                            {amenity.name}
                          </label>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Close button */}
              <div className="flex justify-end mt-8">
                <Button
                  variant="outline"
                  className="text-gray-500 hover:text-gray-700 rounded-full px-6 py-2 text-sm"
                  onClick={() => setShowFilters(false)}
                >
                  <X size={18} className="inline-block mr-2" /> Close
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PropertySearch;
