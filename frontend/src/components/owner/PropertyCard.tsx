import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BedDouble, Bath, Building, MapPin } from 'lucide-react';
import { IProperty } from '../../types/IProperty';



interface PropertyCardProps {
  property: IProperty;
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
        <div className="absolute top-0 right-0 left-0 flex justify-between m-2">
 
  <div className="bg-[#b68451] text-white px-3 py-1 rounded-md text-sm font-semibold">
    ${property.rentPerMonth}/month
  </div>
</div>

      </div>
      <div className="p-5">
      <div className="flex justify-between items-center mb-2">
  <h3 className="text-lg font-bold text-gray-800 truncate">{property.title}</h3>
  <div className={`
    text-xs font-semibold px-2 py-1 rounded 
    ${property.status === 'active' ? 'bg-green-100 text-green-700' : ''}
    ${property.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
    ${property.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}
  `}>
    {property.status}
  </div>
</div>
        <div className="flex items-center text-gray-600 mb-3">
          
          <MapPin size={16} className="text-[#b68451] mr-1" />
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
  to={`/owner/property/${property._id}`}
  className="flex-1 text-center bg-[#dbbd94] text-[#92643f] px-3 py-2 rounded font-medium hover:bg-[#b68451] hover:text-white transition text-sm"
>
  View Details
</Link>
{property.status !== 'rejected' && (
  <Link 
    to={`/owner/edit-property/${property._id}`}
    className="flex-1 text-center border border-[#b68451] text-[#b68451] px-3 py-2 rounded font-medium hover:bg-[#e7d2aa] transition text-sm"
  >
    Edit
  </Link>
)}


        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
