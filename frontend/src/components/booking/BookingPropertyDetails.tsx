import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
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
      {/* Property Details Card */}
      <Card className="relative p-8 bg-gradient-to-br from-white via-[#b38e5d]/3 to-[#b38e5d]/8 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#b38e5d]/10 to-[#b38e5d]/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#b38e5d]/8 to-[#b38e5d]/15 rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-700" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-[#b38e5d] to-[#8b6d47] rounded-full" />
            <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-[#b38e5d] bg-clip-text text-transparent">
              Property Details
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center group/item hover:bg-white/60 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg">
                <div className="w-14 h-14 bg-gradient-to-br from-[#b38e5d] to-[#8b6d47] rounded-2xl flex items-center justify-center shadow-lg mr-5 group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Move-in Date</p>
                  <p className="font-bold text-lg text-slate-800">{format(moveInDate, 'MMM dd, yyyy')}</p>
                  <p className="text-xs text-slate-500">{format(moveInDate, 'EEEE')}</p>
                </div>
              </div>
              
              <div className="flex items-center group/item hover:bg-white/60 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg">
                <div className="w-14 h-14 bg-gradient-to-br from-[#b38e5d] to-[#9c7a50] rounded-2xl flex items-center justify-center shadow-lg mr-5 group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Duration</p>
                  <p className="font-bold text-lg text-slate-800">{duration}</p>
                  <p className="text-xs text-slate-500">Rental Period</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center group/item hover:bg-white/60 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg">
                <div className="w-14 h-14 bg-gradient-to-br from-[#b38e5d] to-[#a5825a] rounded-2xl flex items-center justify-center shadow-lg mr-5 group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Property Type</p>
                  <p className="font-bold text-lg text-slate-800">{propertyType}</p>
                  <p className="text-xs text-slate-500">Category</p>
                </div>
              </div>
              
              <div className="flex items-center group/item hover:bg-white/60 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg">
                <div className="w-14 h-14 bg-gradient-to-br from-[#b38e5d] to-[#8b6d47] rounded-2xl flex items-center justify-center shadow-lg mr-5 group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300">
                  <IndianRupee className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Monthly Rent</p>
                  <p className="font-bold text-xl text-[#b38e5d]">₹{monthlyRent.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Per Month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Location Card */}
      <Card className="relative p-8 bg-gradient-to-br from-white via-[#b38e5d]/3 to-[#b38e5d]/8 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#b38e5d]/8 to-transparent rounded-full -translate-y-20 -translate-x-20 group-hover:scale-110 transition-transform duration-700" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-[#b38e5d] to-[#8b6d47] rounded-full" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-[#b38e5d] bg-clip-text text-transparent">
                Location
              </h3>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#b38e5d] to-[#8b6d47] rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <MapPin className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 group-hover:border-[#b38e5d]/20 transition-all duration-500">
            <div className="h-[350px] relative">
              <PropertyMap 
                latitude={mapLocation?.coordinates?.latitude ?? 0}
                longitude={mapLocation?.coordinates.longitude || 0}
                propertyTitle=""
              />
    
              {/* Map overlay for premium effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#b38e5d]/10 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </Card>

      {/* Amenities Card */}
      <Card className="relative p-8 bg-gradient-to-br from-white via-[#b38e5d]/3 to-[#b38e5d]/8 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden">
        {/* Background decoration */}
        <div className="absolute bottom-0 right-0 w-36 h-36 bg-gradient-to-tl from-[#b38e5d]/15 to-[#b38e5d]/5 rounded-full translate-y-18 translate-x-18 group-hover:scale-110 transition-transform duration-700" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-[#b38e5d] to-[#8b6d47] rounded-full" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-[#b38e5d] bg-clip-text text-transparent">
                Amenities & Features
              </h3>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#b38e5d] to-[#8b6d47] rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <Star className="w-6 h-6 text-white fill-current" />
            </div>
          </div>
          
          {(amenities && Array.isArray(amenities) && amenities.length > 0) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {amenities.map((amenity, index) => {
                const IconComponent = getAmenityIcon(amenity);
                return (
                  <div
                    key={`${amenity}-${index}`}
                    className="group/amenity flex items-center gap-4 bg-white/60 hover:bg-white/80 rounded-2xl p-4 border border-[#b38e5d]/10 hover:border-[#b38e5d]/30 transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#b38e5d] to-[#8b6d47] rounded-xl flex items-center justify-center shadow-md group-hover/amenity:scale-110 group-hover/amenity:rotate-6 transition-all duration-300">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-slate-700 group-hover/amenity:text-[#b38e5d] transition-colors duration-300">
                      {amenity}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-500 font-medium">No amenities information available</p>
              <p className="text-sm text-slate-400 mt-1">Amenities details will be updated soon</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BookingPropertyDetails;