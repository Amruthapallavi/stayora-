import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IProperty } from "../../types/IProperty";

interface PropertySummaryProps {
  property: IProperty | null;
}

const PropertySummary = ({ property }: PropertySummaryProps) => {
  if (!property) return null;

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-lg p-6 border border-[#b68451]/10 shadow-lg hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold text-[#b68451] mb-4">
        Property Summary
      </h3>
      <div className="space-y-4">
        <div className="aspect-video rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium text-[#b68451]">{property.title}</h3>
          <p className="text-sm text-gray-600">{property.city}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Type:</span>
            <span className="ml-2 text-gray-800">{property.type}</span>
          </div>
          <div>
            <span className="text-gray-600">Rent:</span>
            <span className="ml-2 text-gray-800">
              ${property.rentPerMonth}/mo
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
    </div>
  );
};

export default PropertySummary;
