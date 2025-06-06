import { Card } from "../../components/ui/card";
import { Calendar, Clock, Home, IndianRupee, MapPin, Wifi, Car, Coffee, Tv, Shield, Star } from 'lucide-react';
import { format } from 'date-fns';
import PropertyMap from "../user/PropertyMap";

interface BookingPropertyDetailsProps {
  moveInDate: Date;
  duration: string;
  propertyType: string;
  monthlyRent: number;
  amenities: string[];
  mapLocation: {coordinates:{ latitude: number; longitude: number }}
}

const BookingPropertyDetails = ({
  moveInDate,
  duration,
  propertyType,
  monthlyRent,
  amenities,
  mapLocation
}: BookingPropertyDetailsProps) => {

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return Wifi;
    if (amenityLower.includes('parking') || amenityLower.includes('car')) return Car;
    if (amenityLower.includes('coffee') || amenityLower.includes('kitchen')) return Coffee;
    if (amenityLower.includes('tv') || amenityLower.includes('television')) return Tv;
    if (amenityLower.includes('security') || amenityLower.includes('safe')) return Shield;
    return Star;
  };

  return (
    <div className="space-y-8">
 <Card className="p-6 bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
  {/* Header with divider line */}
  <div className="flex items-center mb-6">
    <h3 className="text-xl font-semibold text-gray-800 whitespace-nowrap mr-4">
      Property Details
    </h3>
    <div className="flex-1 h-px bg-gray-300" />
    <div className="w-9 h-9 bg-gradient-to-br from-[#b38e5d] to-[#8b6d47] rounded-full flex items-center justify-center shadow ml-4">
      <Home className="w-5 h-5 text-white" />
    </div>
  </div>

  {/* Details Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Move-in Date */}
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-[#f5f2ed] to-[#e8dfd4] rounded-xl flex items-center justify-center shadow">
        <Calendar className="w-5 h-5 text-[#8b6d47]" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">Move-in Date</p>
        <p className="text-base font-semibold text-gray-800">{format(moveInDate, 'MMM dd, yyyy')}</p>
        <p className="text-xs text-gray-400">{format(moveInDate, 'EEEE')}</p>
      </div>
    </div>

    {/* Duration */}
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-[#f5f2ed] to-[#e8dfd4] rounded-xl flex items-center justify-center shadow">
        <Clock className="w-5 h-5 text-[#8b6d47]" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">Duration</p>
        <p className="text-base font-semibold text-gray-800">{duration}</p>
        <p className="text-xs text-gray-400">Rental Period</p>
      </div>
    </div>

    {/* Property Type */}
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-[#f5f2ed] to-[#e8dfd4] rounded-xl flex items-center justify-center shadow">
        <Home className="w-5 h-5 text-[#8b6d47]" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">Property Type</p>
        <p className="text-base font-semibold text-gray-800">{propertyType}</p>
        <p className="text-xs text-gray-400">Category</p>
      </div>
    </div>

    {/* Monthly Rent */}
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-[#f5f2ed] to-[#e8dfd4] rounded-xl flex items-center justify-center shadow">
        <IndianRupee className="w-5 h-5 text-[#8b6d47]" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">Monthly Rent</p>
        <p className="text-lg font-bold text-[#b38e5d]">₹{monthlyRent.toLocaleString()}</p>
        <p className="text-xs text-gray-400">Per Month</p>
      </div>
    </div>
  </div>
</Card>

<Card className="relative p-8 bg-white/70 backdrop-blur-md border border-[#b38e5d]/30 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden">

  {/* Gold Aura Background Effect */}
  <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-tr from-[#b38e5d]/20 to-transparent rounded-full blur-3xl opacity-70 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />

  {/* Content Container */}
  <div className="relative z-10 flex flex-col gap-6">

    {/* Header with Divider */}
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-10 bg-gradient-to-b from-[#b38e5d] to-[#8b6d47] rounded-full" />
        <h3 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#5a4a23] via-[#8b6d47] to-[#b38e5d]">
          Location
        </h3>
      </div>
      <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#b38e5d] to-[#8b6d47] rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300">
        <MapPin className="w-6 h-6 md:w-7 md:h-7 text-white" />
      </div>
    </div>

    {/* Map Display */}
    <div className="relative rounded-3xl overflow-hidden border-2 border-[#b38e5d]/20 group-hover:border-[#b38e5d]/40 shadow-lg transition-all duration-500">
      <div className="h-[350px] w-full relative">
        <PropertyMap
          latitude={mapLocation?.coordinates?.latitude ?? 0}
          longitude={mapLocation?.coordinates?.longitude ?? 0}
          propertyTitle=""
        />
        {/* Glass-like overlay on map */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#b38e5d]/10 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>

  </div>
</Card>



<Card className="relative p-6 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
  <div className="relative z-10">
    {/* Header */}
    <div className="flex items-center mb-6">
  <h3 className="text-xl font-semibold text-gray-800 whitespace-nowrap mr-4">
    Amenities & Features
  </h3>
  <div className="flex-1 h-px bg-gray-300" />
  <div className="w-9 h-9 bg-[#b38e5d] rounded-full flex items-center justify-center shadow-sm ml-4">
    <Star className="w-5 h-5 text-white" />
  </div>
</div>


    {/* Amenities Grid */}
    {amenities && Array.isArray(amenities) && amenities.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {amenities.map((amenity, index) => {
          const IconComponent = getAmenityIcon(amenity);
          return (
            <div
              key={`${amenity}-${index}`}
              className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-[#b38e5d]/40"
            >
              <div className="w-10 h-10 bg-[#b38e5d] rounded-lg flex items-center justify-center shadow-sm">
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <span className="text-base font-medium text-gray-700">{amenity}</span>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-gray-500" />
        </div>
        <p className="text-gray-500 font-medium">No amenities information available</p>
        <p className="text-sm text-gray-400 mt-1">Amenities details will be updated soon</p>
      </div>
    )}
  </div>
</Card>

    </div>
  );
};

export default BookingPropertyDetails;