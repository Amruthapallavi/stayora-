import { motion } from 'framer-motion';
import { IProperty } from '../../types/property';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';

const cityImages: Record<string, string> = {
  "kannur": "https://assets-news.housing.com/news/wp-content/uploads/2022/09/02151433/places-to-visit-in-kannur-shutterstock_1604282707-1200x700-compressed.jpg",
  "ernakulam": "https://imgcld.yatra.com/ytimages/image/upload/v1433487420/Cochin.jpg",
  "kasargod":"https://static2.tripoto.com/media/filter/tst/img/OgData/1507807944_bekal_fort_kasaragod_kerala_01.jpg",
  "kozhikod":"https://i.pinimg.com/736x/73/60/54/73605474ee029cfd1b3a784948fb5464.jpg",
  "alappuzha":"https://wallpapercave.com/wp/wp7877384.jpg",
  "trivandrum":"https://wallpapercave.com/wp/wp9323579.jpg",

};
interface PopularLocationsProps {
  onSelectLocation: (location: string) => void;
}


function getCityImage(city: string): string {
  return (
    cityImages[city.toLowerCase()] || // 🔥 normalize key
    `https://source.unsplash.com/600x400/?${encodeURIComponent(city)}`
  );
}

const PopularLocations: React.FC<PopularLocationsProps> = ({ onSelectLocation }) => {

  const getAllProperties = useAuthStore((state) => state.getAllProperties);

    const [allProperties, setAllProperties] = useState<IProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const currentPage=1;
    const limit=allProperties.length;
    useEffect(() => {
      async function fetchProperties(page: number, limit: number) {
        setLoading(true);
        try {
          const response = await getAllProperties(page, limit);
  
          if (response && Array.isArray(response.properties)) {
            setAllProperties(response.properties);
           
          } else {
            setAllProperties([]);
          }
        } catch (error) {
          console.error("Error fetching properties:", error);
          setAllProperties([]);
        } finally {
          setLoading(false);
        }
      }
  
      fetchProperties(currentPage, limit);
    }, [ getAllProperties]);
const groupedLocations = (allProperties || []).reduce((acc, property) => {
  const district = (property.district || "Unknown").trim().toLowerCase();
  acc[district] = (acc[district] || 0) + 1;
  return acc;
}, {} as Record<string, number>);


const locationData = Object.entries(groupedLocations)
  .map(([city, count]) => ({
    city,
    count: `${count} Properties`,
    image: getCityImage(city), 
  }))
  .sort((a, b) => parseInt(b.count) - parseInt(a.count)) 
  .slice(0, 4); 
console.log("Grouped locations:", groupedLocations);

function toTitleCase(str: string) {
  return str
    .split(' ')
    .map((word) => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b68451] mx-auto"></div>
            <p className="mt-4 text-lg text-gray-700">Loading properties...</p>
          </div>
        </div>
    );
  }
  return (
    <section className="py-20 bg-gray-100/70">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Popular Locations
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-golden mx-auto mb-6"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          ></motion.div>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Explore properties in these popular cities
          </motion.p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {locationData.map((location, index) => (
           <motion.div
  key={location.city}
  className="relative h-64 rounded-xl overflow-hidden group cursor-pointer"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: index * 0.1 }}
  viewport={{ once: true }}
  whileHover={{ scale: 1.03 }}
  onClick={() => onSelectLocation(location.city)} 
>

              <img 
                src={location.image} 
                alt={location.city} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5 text-white">
<h4 className="font-bold text-xl">{toTitleCase(location.city)}</h4>
                <p>{location.count}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularLocations;
