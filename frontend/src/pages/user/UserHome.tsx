import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import UserLayout from "../../components/user/UserLayout";
import CTASection from "../../components/user/CTASection";
import PopularLocations from "../../components/user/PopularLocations";
import { FaBath, FaBed, FaMapMarkerAlt, FaRupeeSign } from "react-icons/fa";
import { IProperty } from "../../types/property";

const UserHomePage = () => {
  const navigate = useNavigate();
  const { getAllProperties } = useAuthStore();
  const [properties, setProperties] = useState<IProperty[]>([]);

  const [loading, setLoading] = useState(true);
  const limit = 3;
 const handleLocationSelect = (_location: string) => {
  };
  useEffect(() => {
    async function fetchProperties(page: number = 1) {
      setLoading(true);
      try {
        const response = await getAllProperties(page, limit);

        if (response && Array.isArray(response.properties)) {
          const sortedProperties = response.properties.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          const latestThree = sortedProperties.slice(0, 3);

          setProperties(latestThree);
        } else {
          setProperties([]);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);
 if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-golden"></div>
      </div>
    );
  }
  return (
    <UserLayout>
      <div className="bg-gray-100 text-gray-900">
        <section className="relative h-[500px] bg-cover bg-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://png.pngtree.com/background/20230617/original/pngtree-exterior-design-of-a-modern-house-in-the-city-a-3d-picture-image_3683269.jpg')",
            }}
          >
            <div className="text-center text-white">
              <h2 className="text-5xl font-extrabold mb-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
                Find Your Dream Home
              </h2>

              <p className="text-lg max-w-xl mx-auto mb-6">
                Discover the best and most beautiful houses at affordable
                prices, loved by our users.
              </p>
              <button className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-semibold text-lg transition" onClick={()=> navigate('/user/properties')}>
                Explore Listings
              </button>
            </div>
          </div>
        </section>

        {/* Top Rated Houses */}
        <section className="py-16 bg-white">
          <h3 className="text-center text-4xl font-bold mb-4">
            Newly Added Houses
          </h3>
          <p className="text-center max-w-2xl mx-auto mb-12 text-gray-600">
            The best and most beautiful houses with high ratings and affordable
            prices.
          </p>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
            {properties.map((house) => (
              <div
                key={house._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={house.images[0]}
                  alt={house.title}
                  className="w-full h-60 object-cover"
                />
                <div className="p-6">
                  <h4 className="text-2xl font-bold mb-2 text-gray-800">
                    {house.title}
                  </h4>

                  <div className="flex items-center text-gray-600 mb-2 gap-2">
                    <FaMapMarkerAlt className="text-yellow-600" />
                    <span>
                      {house?.city} , {house?.district}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600 my-3">
                    <div className="flex items-center gap-2">
                      <FaBed className="text-blue-600" />
                      <span>{house.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaBath className="text-purple-600" />
                      <span>{house.bathrooms} Baths</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => navigate(`/user/property/${house._id}`)}
                      className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-700 transition"
                    >
                      <FaRupeeSign /> {house.rentPerMonth}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Find The Best Section */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 px-8 mb-8 md:mb-0">
              <h3 className="text-3xl font-bold mb-4">Find The Best</h3>
              <p className="text-gray-600 leading-relaxed">
                Discover beautiful houses with premium amenities, perfect
                locations, and modern designs. We offer top-rated homes that
                meet your needs at an affordable price.
              </p>
            </div>
            <div className="md:w-1/2 px-8">
              <img
                src="/images/bg.jpg"
                alt="Luxury Villa"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-white text-center">
          <h3 className="text-3xl font-bold mb-8">Why Choose Us?</h3>
          <div className="flex justify-center space-x-16">
            <div>
              <h4 className="text-xl font-semibold mb-2">Best Homes</h4>
              <p className="text-gray-600">
                We provide premium homes with affordable prices for you.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">Great Features</h4>
              <p className="text-gray-600">
                Our homes come with top-notch amenities and modern designs.
              </p>
            </div>
          </div>
        </section>
        <PopularLocations onSelectLocation={handleLocationSelect} />
        <CTASection />
      </div>
    </UserLayout>
  );
};

export default UserHomePage;
