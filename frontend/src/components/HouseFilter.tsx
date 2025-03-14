import { useState } from "react";

interface FilterState {
  location: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  furnishing: string;
  availabilityDate: string;
  sortBy: string;
}

const HouseFilter: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    bedrooms: 1,
    bathrooms: 1,
    furnishing: "",
    availabilityDate: "",
    sortBy: "newest",
  });

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle increment and decrement for bedrooms & bathrooms
  const handleIncrement = (field: keyof FilterState) => {
    if (typeof filters[field] === "number") {
      setFilters((prev) => ({
        ...prev,
        [field]: (prev[field] as number) + 1,
      }));
    }
  };

  const handleDecrement = (field: keyof FilterState) => {
    if (typeof filters[field] === "number" && (filters[field] as number) > 1) {
      setFilters((prev) => ({
        ...prev,
        [field]: (prev[field] as number) - 1,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log("Filters Applied: ", filters);
    // Perform API call or filter logic here
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold text-yellow-600 mb-6">Find Your Dream Home</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {/* Location */}
        <div>
          <label className="text-gray-700 font-semibold">Location</label>
          <select
            name="location"
            value={filters.location}
            onChange={handleChange}
            className="mt-2 w-full p-3 border rounded-lg focus:ring-yellow-500"
          >
            <option value="">Select Location</option>
            <option value="bangalore">Bangalore</option>
            <option value="mumbai">Mumbai</option>
            <option value="delhi">Delhi</option>
            <option value="chennai">Chennai</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="text-gray-700 font-semibold">Price Range ($)</label>
          <div className="flex space-x-2 mt-2">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="Min"
              className="w-1/2 p-3 border rounded-lg focus:ring-yellow-500"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Max"
              className="w-1/2 p-3 border rounded-lg focus:ring-yellow-500"
            />
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="text-gray-700 font-semibold">Property Type</label>
          <select
            name="propertyType"
            value={filters.propertyType}
            onChange={handleChange}
            className="mt-2 w-full p-3 border rounded-lg focus:ring-yellow-500"
          >
            <option value="">Select Type</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
            <option value="penthouse">Penthouse</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="text-gray-700 font-semibold">Bedrooms</label>
          <div className="flex mt-2 items-center space-x-4">
            <button
              type="button"
              onClick={() => handleDecrement("bedrooms")}
              className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
            >
              −
            </button>
            <span className="text-lg">{filters.bedrooms}</span>
            <button
              type="button"
              onClick={() => handleIncrement("bedrooms")}
              className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="text-gray-700 font-semibold">Bathrooms</label>
          <div className="flex mt-2 items-center space-x-4">
            <button
              type="button"
              onClick={() => handleDecrement("bathrooms")}
              className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
            >
              −
            </button>
            <span className="text-lg">{filters.bathrooms}</span>
            <button
              type="button"
              onClick={() => handleIncrement("bathrooms")}
              className="bg-yellow-500 text-white px-3 py-1 rounded-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Furnishing */}
        <div>
          <label className="text-gray-700 font-semibold">Furnishing</label>
          <select
            name="furnishing"
            value={filters.furnishing}
            onChange={handleChange}
            className="mt-2 w-full p-3 border rounded-lg focus:ring-yellow-500"
          >
            <option value="">Select Furnishing</option>
            <option value="furnished">Fully Furnished</option>
            <option value="semi-furnished">Semi-Furnished</option>
            <option value="unfurnished">Unfurnished</option>
          </select>
        </div>

        {/* Availability Date */}
        <div>
          <label className="text-gray-700 font-semibold">Available From</label>
          <input
            type="date"
            name="availabilityDate"
            value={filters.availabilityDate}
            onChange={handleChange}
            className="mt-2 w-full p-3 border rounded-lg focus:ring-yellow-500"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="text-gray-700 font-semibold">Sort By</label>
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            className="mt-2 w-full p-3 border rounded-lg focus:ring-yellow-500"
          >
            <option value="newest">Newest</option>
            <option value="priceLow">Lowest Price</option>
            <option value="priceHigh">Highest Price</option>
          </select>
        </div>
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={handleSubmit}
        className="mt-8 w-full bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600 transition"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default HouseFilter;
