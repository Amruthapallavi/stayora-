import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Copy, Check, Calendar, Clock, Star, Shield, Award } from 'lucide-react';
import { Badge } from "../../components/ui/badge";
import { useState } from 'react';

const BookingHeader = ({ propertyName, address, status, bookingId }: {
  propertyName: string;
  address: string;
  status: string;
  bookingId: "confirmed" | "pending" | "cancelled"
}) => {
  const [copied, setCopied] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return {
          bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
          badge: 'bg-gradient-to-r from-emerald-500 to-green-600',
          dot: 'bg-emerald-500',
          icon: Shield,
          glow: 'shadow-emerald-200/50'
        };
      case 'pending':
        return {
          bg: 'bg-gradient-to-r from-[#b38e5d]/5 to-amber-50',
          badge: 'bg-gradient-to-r from-[#b38e5d] to-[#8b6d47]',
          dot: 'bg-[#b38e5d]',
          icon: Clock,
          glow: 'shadow-[#b38e5d]/30'
        };
      case 'cancelled':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-pink-50',
          badge: 'bg-gradient-to-r from-red-500 to-red-600',
          dot: 'bg-red-500',
          icon: Calendar,
          glow: 'shadow-red-200/50'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-[#b38e5d]/5 to-slate-50',
          badge: 'bg-gradient-to-r from-[#b38e5d] to-[#8b6d47]',
          dot: 'bg-[#b38e5d]',
          icon: Award,
          glow: 'shadow-[#b38e5d]/30'
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  const copyBookingId = async () => {
    try {
      await navigator.clipboard.writeText(bookingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy booking ID');
    }
  };

  return (
    <div className="max-w-6xl mx-auto mb-8 relative">
      {/* Decorative Background Elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#b38e5d]/10 to-[#b38e5d]/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-[#b38e5d]/8 to-transparent rounded-full blur-2xl" />
      
      {/* Premium Badge */}
      {/* <div className="absolute -top-3 left-8 z-10">
        <div className="bg-gradient-to-r from-[#b38e5d] to-[#8b6d47] text-white px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
        </div>
      </div> */}

      {/* Back Button */}
      <div className="mb-8 relative z-10">
        <Link 
          to="/user/bookings" 
          className="inline-flex items-center gap-3 text-slate-600 hover:text-[#b38e5d] transition-all duration-300 group"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-white border-2 border-[#b38e5d]/20 flex items-center justify-center group-hover:border-[#b38e5d] group-hover:bg-[#b38e5d] transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#b38e5d]/25">
              <ArrowLeft className="w-5 h-5 group-hover:text-white transition-colors duration-300" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-[#b38e5d]/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
          </div>
          <div>
            <span className="font-semibold text-sm block">← Back to Bookings</span>
            <span className="text-xs text-slate-500">View all your reservations</span>
          </div>
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="relative">
        <div className="bg-white rounded-3xl shadow-xl border border-[#b38e5d]/10 overflow-hidden backdrop-blur-sm">
          {/* Gradient Top Border */}
          <div className="h-1.5 bg-gradient-to-r from-[#b38e5d] via-[#8b6d47] to-[#b38e5d]" />
          
          <div className="p-8 relative">
            {/* Floating Decoration */}
            <div className="absolute top-4 right-6 w-20 h-20 bg-gradient-to-br from-[#b38e5d]/10 to-[#b38e5d]/5 rounded-full blur-xl" />
            
            <div className="flex items-start justify-between gap-8">
              {/* Left Content */}
              <div className="flex-1 relative z-10">
                {/* Property Name with Decorative Element */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-2 h-16 bg-gradient-to-b from-[#b38e5d] to-[#8b6d47] rounded-full shadow-lg" />
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-[#b38e5d] bg-clip-text text-transparent leading-tight mb-2">
                      {propertyName}
                    </h1>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-gradient-to-r from-[#b38e5d] to-transparent" />
                      <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">Luxury Accommodation</span>
                    </div>
                  </div>
                </div>
                
                {/* Address with Enhanced Styling */}
                <div className="flex items-start gap-4 mb-8 group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#b38e5d] to-[#8b6d47] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[#b38e5d]/25 transition-all duration-300">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">Property Location</p>
                    <p className="text-lg text-slate-700 leading-relaxed font-medium">{address}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-1 h-1 bg-[#b38e5d] rounded-full" />
                      <span className="text-xs text-slate-500">Verified Address</span>
                    </div>
                  </div>
                </div>

                {/* Booking ID with Premium Styling */}
                <div className="relative">
                  <div className="bg-gradient-to-r from-[#b38e5d]/10 via-white to-[#b38e5d]/5 rounded-2xl p-6 border border-[#b38e5d]/20 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b38e5d] to-[#8b6d47] flex items-center justify-center shadow-lg">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Booking Reference</p>
                          <p className="text-xl font-bold text-[#b38e5d] font-mono tracking-wider">#{bookingId}</p>
                        </div>
                      </div>
                      <button
                        onClick={copyBookingId}
                        className="w-10 h-10 rounded-xl bg-white border-2 border-[#b38e5d]/20 flex items-center justify-center hover:border-[#b38e5d] hover:bg-[#b38e5d] hover:scale-110 transition-all duration-300 group/copy shadow-lg"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-emerald-600 group-hover/copy:text-white" />
                        ) : (
                          <Copy className="w-5 h-5 text-[#b38e5d] group-hover/copy:text-white" />
                        )}
                      </button>
                    </div>
                    {copied && (
                      <div className="absolute -top-12 right-0 bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium animate-pulse">
                        Copied to clipboard!
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Content - Enhanced Status */}
              <div className="flex-shrink-0 text-right">
                <div className="mb-4">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Booking Status</p>
                  <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${statusConfig.bg} border border-white/50 shadow-lg ${statusConfig.glow} backdrop-blur-sm`}>
                    <div className="relative">
                      <div className={`w-3 h-3 rounded-full ${statusConfig.dot} animate-pulse`} />
                      <div className={`absolute inset-0 w-3 h-3 rounded-full ${statusConfig.dot} animate-ping opacity-75`} />
                    </div>
                    <StatusIcon className="w-4 h-4 text-slate-700" />
                    <span className="text-sm font-bold text-slate-800 capitalize tracking-wide">{status}</span>
                  </div>
                </div>
                
          
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Glow Effect */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-gradient-to-r from-transparent via-[#b38e5d]/20 to-transparent blur-xl" />
      </div>
    </div>
  );
};

export default BookingHeader;