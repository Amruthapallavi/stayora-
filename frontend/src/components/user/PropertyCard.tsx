import { motion } from "framer-motion";
import { BedDouble, Bath, Building, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface Property {
  _id: string;
  title: string;
  location: string;
  beds: number;
  baths: number;
  type: string;
  price: string;
  image: string;
}

const PropertyCard = ({ property }: { property: Property }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
      whileHover={{ y: -5 }}
    >
      <div className="relative h-60">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 bg-golden text-white px-3 py-1 m-2 rounded-md text-sm font-semibold">
          ₹{property.price}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{property.title}</h3>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin size={16} className="text-golden mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <BedDouble size={16} className="mr-1" />
            <span>{property.beds} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath size={16} className="mr-1" />
            <span>{property.baths} Baths</span>
          </div>
          <div className="flex items-center">
            <Building size={16} className="mr-1" />
            <span>{property.type}</span>
          </div>
        </div>
        <Link
          to={`/property/${property._id}`}
          className="block text-center bg-golden-light text-golden-dark px-4 py-2 rounded font-medium hover:bg-golden hover:text-white transition"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
