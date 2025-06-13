import { IProperty } from "../../types/property";
import { Link } from "react-router-dom";

interface PropertySummaryProps {
  property: IProperty | null;
}

const PropertySummary = ({ property }: PropertySummaryProps) => {
  if (!property) return null;

  return (
    <div className="w-full max-w-full lg:max-w-4xl bg-white/70 backdrop-blur-md rounded-lg p-6 border border-[#b68451]/10 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6">
      {/* Left Side - Image */}
      <div className="md:w-1/2 w-full aspect-video rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]">
        <img
          src={property.images?.[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Details */}
      <div className="md:w-1/2 w-full flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold text-[#a67c00] mb-2">
            {property.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{property.city}</p>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-gray-600">Type:</span>
              <span className="ml-2 text-gray-800">{property.type}</span>
            </div>
            <div>
              <span className="text-gray-600">Rent:</span>
              <span className="ml-2 text-gray-800">
                ₹{property.rentPerMonth}/month
              </span>
            </div>
            <div>
              <span className="text-gray-600">Bedrooms:</span>
              <span className="ml-2 text-gray-800">{property.bedrooms}</span>
            </div>
            <div>
              <span className="text-gray-600">Bathrooms:</span>
              <span className="ml-2 text-gray-800">{property.bathrooms}</span>
            </div>
          </div>
        </div>

        <Link
          to={`/owner/property/${property._id}`}
          className="inline-block px-4 py-2 rounded-md bg-[#a67c00] text-white text-sm font-medium hover:bg-[#8e6500] transition duration-300 w-full text-center mt-4"
        >
          View Full Details
        </Link>
      </div>
    </div>
  );
};

export default PropertySummary;
