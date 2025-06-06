import { IProperty } from "../../types/property";
import { Link } from "react-router-dom";

interface PropertySummaryProps {
  property: IProperty | null;
}

const PropertySummary = ({ property }: PropertySummaryProps) => {
  if (!property) return null;

  return (
    <div className="w-full max-w-full lg:max-w-md bg-white/70 backdrop-blur-md rounded-lg p-6 border border-[#b68451]/10 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
      <h3 className="text-lg font-semibold text-[#b68451] mb-4">
        Property Summary
      </h3>

      <div className="space-y-4 flex-1 overflow-auto">
        {/* Image */}
        <div className="aspect-video rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]">
          <img
            src={property.images?.[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title & City */}
        <div>
          <h3 className="font-medium text-[#b68451]">{property.title}</h3>
          <p className="text-sm text-gray-600">{property.city}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
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

        {/* Button */}
        <div className="pt-4">
          <Link
            to={`/owner/property/${property._id}`}
            className="inline-block px-4 py-2 rounded-md bg-[#b68451] text-white text-sm font-medium hover:bg-[#9e6f3d] transition duration-300 w-full text-center"
          >
            View Full Details
          </Link>
        </div>
      </div>
    </div>
  );
};


export default PropertySummary;
