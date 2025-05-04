import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Calendar, Clock, Home, DollarSign, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';
import Map from '../../components/owner/map';

interface BookingPropertyDetailsProps {
  moveInDate: Date;
  duration: string;
  propertyType: string;
  monthlyRent: number;
  amenities: string[];
  location: { lat: number; lng: number };
}

const BookingPropertyDetails = ({
  moveInDate,
  duration,
  propertyType,
  monthlyRent,
  amenities,
  location
}: BookingPropertyDetailsProps) => {
    console.log(amenities)
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-golden mr-2" />
              <div>
                <p className="text-sm text-gray-600">Move-in Date</p>
                <p className="font-medium">{format(moveInDate, 'MMM dd, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-golden mr-2" />
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium">{duration}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <Home className="w-5 h-5 text-golden mr-2" />
              <div>
                <p className="text-sm text-gray-600">Property Type</p>
                <p className="font-medium">{propertyType}</p>
              </div>
            </div>
            <div className="flex items-center">
              <IndianRupee className="w-5 h-5 text-golden mr-2" />
              <div>
                <p className="text-sm text-gray-600">Monthly Rent</p>
                <p className="font-medium">₹{monthlyRent}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Location</h3>
        <div className="h-[300px] rounded-lg overflow-hidden">
          <Map selectedLocation={location} onLocationSelect={() => {}} />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Amenities</h3>
        <div className="flex flex-wrap gap-2">
          {amenities.map((amenity) => (
            <Badge key={amenity} variant="outline">
              {amenity}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default BookingPropertyDetails;
