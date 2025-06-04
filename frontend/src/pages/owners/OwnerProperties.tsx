import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import PropertyCard from "../../components/owner/PropertyCard";
import { useAuthStore } from "../../stores/authStore";
import { notifyError } from "../../utils/notifications";
import OwnerLayout from "../../components/owner/OwnerLayout";
import { IProperty } from "../../types/property";
import Pagination from "../../components/user/UserPagination";

const Properties = () => {
  const { getProperties } = useAuthStore();
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadProperties(currentPage, searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, currentPage]);

  const loadProperties = async (page = 1, searchTerm: string) => {
    try {
      setLoading(true);
      const response = await getProperties(page, limit, searchTerm);
      console.log(response, "response for owner properties");
      setCurrentPage(response?.currentPage ?? 1);

      setProperties(response.properties);
      setTotalPages(response?.totalPages ?? 1);
    } catch (error) {
      notifyError("Failed to load properties");
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <OwnerLayout>
      <div className="flex">
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h1 className="text-2xl font-bold text-golden-dark">
                My Properties
              </h1>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-golden focus:border-transparent"
                  />
                </div>

                <Link
                  to="/owner/add-property"
                  className="bg-[#b68451] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#92643f] transition inline-flex items-center justify-center"
                >
                  <Plus size={18} className="mr-2" />
                  <span>Add Property</span>
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-golden"></div>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  No properties found
                </h2>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? "No properties match your search criteria."
                    : "You haven't added any properties yet."}
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
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8 space-x-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </OwnerLayout>
  );
};

export default Properties;
