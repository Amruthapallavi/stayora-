import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { User, Phone, Mail, MessageSquare } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface BookingOwnerCardProps {
  owner: {
    id:string;
    name: string;
    phone: string;
    email: string;
    propertyId:string;
  };
    type?: 'owner' | 'guest'; 

}

const BookingOwnerCard = ({ owner, type = 'guest' }: BookingOwnerCardProps) => {
  const navigate = useNavigate();

  const isOwner = type === 'owner';

  return (
    <Card className="relative p-6 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            {isOwner ? 'Owner Information' : 'Guest Information'}
          </h3>
          <div className="w-10 h-10 bg-[#b38e5d] rounded-full flex items-center justify-center shadow-sm">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Info List */}
        <div className="space-y-4">
          {/* Name */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
            <div className="w-10 h-10 bg-[#b38e5d] rounded-full flex items-center justify-center shadow-sm">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Name</p>
              <p className="text-base font-semibold text-gray-800">{owner.name}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
            <div className="w-10 h-10 bg-[#b38e5d] rounded-full flex items-center justify-center shadow-sm">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Phone</p>
              <p className="text-base font-semibold text-gray-800">{owner.phone}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
            <div className="w-10 h-10 bg-[#b38e5d] rounded-full flex items-center justify-center shadow-sm">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
              <p className="text-base font-semibold text-gray-800 break-all">{owner.email}</p>
            </div>
          </div>
        </div>

        {/* Button */}
        <Button
          className="w-full mt-6 bg-[#b38e5d] hover:bg-[#a5825a] text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          onClick={() => navigate(`/user/chat/${owner.propertyId}/${owner.id}`)}
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          {isOwner ? 'Contact Owner' : 'Contact Guest'}
        </Button>
      </div>
    </Card>
  );
};


export default BookingOwnerCard;