import { cn } from '../../lib/utils';

type StatusType = 'pending' |'blocked'| 'approved' | 'rejected' | 'active' | 'inactive' | 'suspended' | 'confirmed' | 'cancelled' | 'completed' | 'paid' | 'refunded' |'booked';

interface StatusBadgeProps {
  status: StatusType | string ;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const statusClasses = {
    // Property & Booking Statuses
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    confirmed: "bg-blue-100 text-blue-800",
    blocked: "bg-red-100 text-red-800",

    cancelled: "bg-gray-100 text-gray-800",
    completed: "bg-purple-100 text-purple-800",
    booked: "bg-green-100 text-green-800",

    // User & Owner Statuses
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-600",
    suspended: "bg-red-100 text-red-800",
    
    // Payment Statuses
    paid: "bg-green-100 text-green-800",
    refunded: "bg-orange-100 text-orange-800",
  };

  const statusClass = statusClasses[status] || "bg-gray-100 text-gray-800";

  return (
    <span className={cn(baseClasses, statusClass, className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
