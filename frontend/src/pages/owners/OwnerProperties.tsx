


import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import PropertyCard from '../../components/owner/PropertyCard';
import { useAuthStore } from '../../stores/authStore';
import { notifyError } from '../../utils/notifications';
// import Sidebar from '../../components/owner/Sidebar';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { IProperty } from '../../types/IProperty';

// interface Property {
//   id: string;
//   title: string;
//   type: string;
//   bedrooms: number;
//   bathrooms: number;
//   city: string;
//   state: string;
//   rentPerMonth: number;
//   images: string[];
// }


const Properties = () => {
  const { getProperties } = useAuthStore();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await getProperties();
      setProperties(response.properties);
    } catch (error) {
      notifyError('Failed to load properties');
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };
  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <OwnerLayout>
<div className="flex">
  {/* <Sidebar /> */}
  <div className="flex-1 p-4 md:p-8">
    {/* Main content here */}

      <div className="max-w-6xl mx-auto">
        {/* Header with search and add button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-golden-dark">My Properties</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-golden focus:border-transparent"
              />
            </div>
            
            {/* Add property button */}
            <Link 
              to="/owner/add-property"
              className="bg-[#b68451] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#92643f] transition inline-flex items-center justify-center"
            >
              <Plus size={18} className="mr-2" />
              <span>Add Property</span>
            </Link>
          </div>
        </div>
        
        {/* Property listing */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-golden"></div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No properties found</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'No properties match your search criteria.' : 'You haven\'t added any properties yet.'}
            </p>
            <Link 
              to="/owner/add-property"
              className="bg-[#b68451] text-white px-6 py-3 rounded-md shadow-md hover:bg-[#92643f] transition inline-flex items-center justify-center"
            >
              <Plus size={18} className="mr-2" />
              <span>Add Your First Property</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
    </OwnerLayout>
  );
};

export default Properties;



