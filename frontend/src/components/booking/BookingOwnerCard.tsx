import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { User, Phone, Mail, MessageSquare } from 'lucide-react';

interface BookingOwnerCardProps {
  owner: {
    name: string;
    phone: string;
    email: string;
  };
}

const BookingOwnerCard = ({ owner }: BookingOwnerCardProps) => {

  return (
    <Card className="relative p-8 bg-gradient-to-br from-white via-[#b38e5d]/5 to-[#b38e5d]/10 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#b38e5d]/20 to-[#b38e5d]/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#b38e5d]/15 to-[#b38e5d]/25 rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Guest Information
          </h3>
          <div className="w-10 h-10 bg-gradient-to-br from-[#b38e5d] to-[#8b6d47] rounded-full flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center group/item hover:bg-white/60 rounded-xl p-3 transition-all duration-300 hover:shadow-md">
            <div className="w-12 h-12 bg-gradient-to-br from-[#b38e5d] to-[#8b6d47] rounded-full flex items-center justify-center shadow-lg mr-4 group-hover/item:scale-110 transition-transform duration-300">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Name</p>
              <p className="font-semibold text-slate-800 text-lg">{owner.name}</p>
            </div>
          </div>
          
          <div className="flex items-center group/item hover:bg-white/60 rounded-xl p-3 transition-all duration-300 hover:shadow-md">
            <div className="w-12 h-12 bg-gradient-to-br from-[#b38e5d] to-[#9c7a50] rounded-full flex items-center justify-center shadow-lg mr-4 group-hover/item:scale-110 transition-transform duration-300">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Phone</p>
              <p className="font-semibold text-slate-800 text-lg">{owner.phone}</p>
            </div>
          </div>
          
          <div className="flex items-center group/item hover:bg-white/60 rounded-xl p-3 transition-all duration-300 hover:shadow-md">
            <div className="w-12 h-12 bg-gradient-to-br from-[#b38e5d] to-[#a5825a] rounded-full flex items-center justify-center shadow-lg mr-4 group-hover/item:scale-110 transition-transform duration-300">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Email</p>
              <p className="font-semibold text-slate-800 text-lg break-all">{owner.email}</p>
            </div>
          </div>
        </div>
        
        <Button className="w-full mt-8 bg-gradient-to-r from-[#b38e5d] to-[#8b6d47] hover:from-[#a5825a] hover:to-[#7a5e3e] text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 group/button">
          <MessageSquare className="w-5 h-5 mr-3 group-hover/button:rotate-12 transition-transform duration-300" />
          <span className="text-base">Contact Guest</span>
        </Button>
      </div>
    </Card>
  );
};

export default BookingOwnerCard;