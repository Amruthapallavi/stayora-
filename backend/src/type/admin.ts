export interface DashboardData {
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
    verifiedUsers: number;
    totalOwners: number;
    activeOwner: number;
    blockedOwners: number;
    totalBookings: number;
    completedBookings: number;
    activeBookings: number;
    cancelledBookings: number;
    totalBookingCount: number;
    totalRevenue: number;
    totalProperties: number;
    activeProperties: number;
    bookedProperties: number;
    rejectedProperties: number;
    pendingProperties: number;
    userActivityData: { month: string; users: number; owners: number; bookings: number }[];
    revenueData: { month: string; revenue: number }[];
  }
  