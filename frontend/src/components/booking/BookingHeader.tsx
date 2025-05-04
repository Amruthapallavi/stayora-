import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Badge } from "../../components/ui/badge";

const BookingHeader = ({ propertyName, address, status,bookingId }: {
  propertyName: string;
  address: string;
  status: string;
  bookingId:"confirmed"|"pending"|"cancelled"
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      <Link to="/user/bookings" className="inline-flex items-center text-gray-600 hover:text-golden mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Bookings
      </Link>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{propertyName}</h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            {address} <br />
          </div>
          <h2>Booking ID :{bookingId}</h2>

        </div>
       <Badge variant={status}>{status}</Badge>

      </div>
    </div>
  );
};

export default BookingHeader;
