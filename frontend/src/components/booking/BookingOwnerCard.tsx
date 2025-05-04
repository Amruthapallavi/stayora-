import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { User, Phone, Mail, MessageSquare } from 'lucide-react';
import { IOwner } from "../../types/IOwner";

// interface BookingOwnerCardProps {
//   owner: {
//     name: string;
//     phone: string;
//     email: string;
//   };
// }

const BookingOwnerCard = ({ owner }: IOwner) => {
    console.log(owner,"kju")
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Guest Information</h3>
      <div className="space-y-4">
        <div className="flex items-center">
          <User className="w-5 h-5 text-golden mr-2" />
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{owner.name}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Phone className="w-5 h-5 text-golden mr-2" />
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium">{owner.phone}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Mail className="w-5 h-5 text-golden mr-2" />
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{owner.email}</p>
          </div>
        </div>
      </div>
      <Button className="w-full mt-4">
        <MessageSquare className="w-4 h-4 mr-2" />
        Contact Owner
      </Button>
    </Card>
  );
};

export default BookingOwnerCard;
