

  
 export interface DashboardData {
    activeBookings: number;
    activeOwner: number;
    activeProperties: number;
    activeUsers: number;
    blockedOwners: number;
    blockedUsers: number;
    bookedProperties: number;
    cancelledBookings: number;
    completedBookings: number;
    pendingProperties: number;
    rejectedProperties: number;
    revenueData: RevenueEntry[];
    totalBookingCount: number;
    totalBookings: number;
    totalOwners: number;
    totalProperties: number;
    totalRevenue: number;
    subscriptionRevenue:number;
    totalUsers: number;
    userActivityData: any[]; 
    verifiedUsers: number;
    bookingsByMonth?:MonthlyBookingStats[];
  }
  export interface MonthlyBookingStats {
  name: string;       
  bookings: number;   
  revenue: number;    
}

  export interface IAdminDashboardData {
    data: DashboardData;
    message: string;
  }
  
  export interface RevenueEntry  {
    month: string;
    revenue: number;
  };