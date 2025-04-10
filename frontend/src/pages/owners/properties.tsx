import { useState } from "react";
import { Edit, Trash, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/owner/Sidebar";

const properties = [
  {
    id: 1,
    name: "Luxury Ensuite Room",
    price: "$450 / Night",
    size: "35sqm",
    view: "City",
    status: "Occupied",
    image: "https://via.placeholder.com/400",
  },
  {
    id: 2,
    name: "Deluxe Queen Room",
    price: "$300 / Night",
    size: "35sqm",
    view: "City",
    status: "Vacant",
    image: "https://via.placeholder.com/400",
  },
  {
    id: 3,
    name: "King Suite",
    price: "$500 / Night",
    size: "40sqm",
    view: "Ocean",
    status: "Occupied",
    image: "https://via.placeholder.com/400",
  },
];

const OwnerPropertyListing = () => {
  const [propertyList, setPropertyList] = useState(properties);
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    setPropertyList(propertyList.filter((property) => property.id !== id));
  };

  return (
    <div className="flex">
      
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      <Sidebar />

        <div className="flex justify-between items-center mb-6">
          <motion.h1
            className="text-4xl font-bold text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Explore Our Premium Properties
          </motion.h1>
          <button
            onClick={() => navigate("/owner/add-property")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} /> Add Property
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {propertyList.map((property) => (
            <motion.div
              key={property.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden relative"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-48 object-cover"
              />
              <span
                className={`absolute top-2 left-2 px-3 py-1 rounded-full text-white text-xs font-bold ${
                  property.status === "Vacant" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {property.status}
              </span>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {property.name}
                </h2>
                <p className="text-sm text-gray-600">Size: {property.size}</p>
                <p className="text-sm text-gray-600">View: {property.view}</p>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  {property.price}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <button className="text-blue-500 hover:text-blue-700">
                    <Edit size={20} />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(property.id)}
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerPropertyListing;