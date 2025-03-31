
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BedDouble, Bath, Building, MapPin } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  city: string;
  state: string;
  rentPerMonth: number;
  images: string[];
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
      whileHover={{ y: -5 }}
    >
      <div className="relative h-48">
        <img 
          src={property.images[0] || 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3'} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 bg-golden text-white px-3 py-1 m-2 rounded-md text-sm font-semibold">
          ${property.rentPerMonth}/mo
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{property.title}</h3>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin size={16} className="text-golden mr-1" />
          <span className="text-sm truncate">{property.city}, {property.state}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <BedDouble size={16} className="mr-1" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath size={16} className="mr-1" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center">
            <Building size={16} className="mr-1" />
            <span>{property.type}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link 
            to={`/property/${property.id}`}
            className="flex-1 text-center bg-golden-light text-golden-dark px-3 py-2 rounded font-medium hover:bg-golden hover:text-white transition text-sm"
          >
            View Details
          </Link>
          <Link 
            to={`/owner/edit-property/${property.id}`}
            className="flex-1 text-center border border-golden text-golden px-3 py-2 rounded font-medium hover:bg-golden-light transition text-sm"
          >
            Edit
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;