
export interface MonthlyAnalyticsData {
  month: string;
  users: number;
  owners: number;
  bookings: number;
}

export interface RevenueChartData {
  month: string;
  revenue: number;
}

export interface DashboardDataDTO {
  totalUsers: number;
  totalOwners: number;
  totalBookings: number;
  completedBookings: number;
  activeBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  totalProperties: number;
  activeProperties: number;
  bookedProperties: number;
  rejectedProperties: number;
  pendingProperties: number;
  userActivityData: MonthlyAnalyticsData[];
  revenueData: RevenueChartData[];
  activeUsers: number;
  blockedUsers: number;
  verifiedUsers: number;
  activeOwner: number;
  blockedOwners: number;
  totalBookingCount: number;
}

export interface DashboardResponseDTO {
  data: DashboardDataDTO | null;
  status: number;
  message: string;
}
