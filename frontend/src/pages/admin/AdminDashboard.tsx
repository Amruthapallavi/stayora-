
import { useEffect, useState } from "react";
import { BarChart, Users, ShoppingBag, Moon, Sun, Building, Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import AdminLayout from "../../components/admin/AdminLayout";
import { StatsCard } from "../../components/admin/StatsCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from "recharts";
import { Button } from "../../components/ui/button";
import { useAuthStore } from "../../stores/authStore";
import { TooltipProvider } from "../../components/ui/tooltip";
import useDarkMode from "../../components/Theme";
import { DashboardData, RevenueEntry } from "../../types/admin";



const AdminDashboard = () => {

  const { darkMode, toggleDarkMode } = useDarkMode();
 const {getDashboardData}=useAuthStore();
 const [dashboardData, setDashboardData] = useState<DashboardData | null>(null); 
const [revenueData, setRevenueData] = useState<RevenueEntry[]>([]);
const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData() 
        setDashboardData(response.data);  
        setRevenueData(response.data?.revenueData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    fetchDashboardData();
  }, []);


  const stats = [
    {
      label: "Total  Users",
      value: dashboardData?.totalUsers ,
      icon: Users,
      trend: { value: 12.5, isPositive: true },
      gradientFrom: "blue-400",
      viewMore:"/admin/users",
      gradientTo: "blue-600",
      details: [
        { label: "Active Users", value:dashboardData?.activeUsers, color: "green" },
        { label: "Verified Users", value: dashboardData?.verifiedUsers, color: "yellow" },
        { label: "Blocked Users", value: dashboardData?.blockedUsers, color: "red" },
      ] 
    
    },
    {
      label: "Total Owners",
      value: dashboardData?.totalOwners ?? 0,
      icon: Building,
      trend: { value: 8.2, isPositive: true },
      viewMore:"/admin/owners",

      gradientFrom: "indigo-400",
      gradientTo: "indigo-600",
      details: [
        { label: "Active Owners ", value:dashboardData?.activeOwner, color: "green" },
        { label: "Blocked Owners", value: dashboardData?.blockedOwners, color: "red" },
      ] 
    },
    {
      label: "Total Bookings",
      value: dashboardData?.totalBookingCount ?? 0,
      icon: Calendar,
      viewMore:"/admin/bookings",

      trend: { value: 3.1, isPositive: false },
      gradientFrom: "green-400",
      gradientTo: "green-600",
      details: [
        { label: "Active Bookings ", value:dashboardData?.activeBookings, color: "green" },
        { label: "Completed Bookings", value: dashboardData?.completedBookings, color: "yellow" },
        { label: "Cancelled Bookings", value: dashboardData?.cancelledBookings, color: "red" },
      ] 
    },
    {
      label: "Total Properties",
      value: dashboardData?.totalProperties ?? 0,
      icon: MapPin,
      viewMore:"/admin/properties",

      trend: { value: 14.5, isPositive: true },
      gradientFrom: "amber-400",
      gradientTo: "amber-600",
      details: [
        { label: "Active Properties", value:dashboardData?.activeProperties, color: "green" },
        { label: "Pending Properties", value: dashboardData?.pendingProperties, color: "yellow" },
        { label: "Rejected Properties", value: dashboardData?.rejectedProperties, color: "red" },
      ] 
    },
    {
      label: "Subscription Revenue",
      value:`₹${dashboardData?.subscriptionRevenue ?? 0}`,
      icon: ShoppingBag,
      trend: { value: 5.8, isPositive: true },
      gradientFrom: "rose-400",
      gradientTo: "rose-600",
    },
    
    {
      label: "Total Revenue",
      value: `₹${dashboardData?.totalRevenue?.toLocaleString() ?? "0"}`,
      icon: BarChart,
      trend: { value: 9.3, isPositive: true },
      gradientFrom: "purple-400",
      gradientTo: "purple-600",
    },
  ];
  const paddedRevenueData = revenueData.length === 1
  ? [
    { month: 'feb 2025', revenue: 0 },

      { month: 'Mar 2025', revenue: 0 },
      ...revenueData,
    ]
  : revenueData;

  

  return (
    <AdminLayout>
          <TooltipProvider>

      <div className="p-0 md:p-2">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex justify-between items-center"
        >
          
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Welcome back! Here's what's happening with your properties today.
            </p>
          </div>
          
          <Button
      onClick={toggleDarkMode}
      size="icon"
      variant="outline"
      className="h-10 w-10 rounded-full"
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: darkMode ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </motion.div>
    </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              link={stat.viewMore}
              trend={stat.trend}
              index={index}
              gradientFrom={stat.gradientFrom}
              gradientTo={stat.gradientTo}
              details={stat.details?.map(detail => ({
                ...detail,
                value: (detail.value !== undefined ? detail.value : 0) as string | number, // Ensure value is string or number
              }))}            />
          ))}
          </div>
          
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5"
          >
            <h3 className="text-lg font-semibold mb-4">User Activity</h3>
            <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
  <AreaChart data={dashboardData?.userActivityData}>
    <defs>
      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="colorOwners" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
        <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
      </linearGradient>
    </defs>
    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
    <Tooltip 
      contentStyle={{ 
        backgroundColor: darkMode ? '#374151' : '#fff',
        borderColor: darkMode ? '#4B5563' : '#E5E7EB',
        color: darkMode ? '#F9FAFB' : '#111827',
        borderRadius: '0.375rem',
      }}
    />
    <Legend />
    <Area type="monotone" dataKey="users" stroke="#8884d8" fillOpacity={1} fill="url(#colorUsers)" />
    <Area type="monotone" dataKey="owners" stroke="#ffc658" fillOpacity={1} fill="url(#colorOwners)" />
    <Area type="monotone" dataKey="bookings" stroke="#82ca9d" fillOpacity={1} fill="url(#colorBookings)" />
  </AreaChart>
</ResponsiveContainer>

            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5"
          >
            <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={paddedRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#374151' : '#fff',
                      borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                      color: darkMode ? '#F9FAFB' : '#111827',
                      borderRadius: '0.375rem',
                    }}
                    formatter={(value) => [`₹${value}`, 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8b5cf6" 
                    strokeWidth={3} 
                    dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 4, fill: darkMode ? '#1F2937' : '#fff' }} 
                    activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: darkMode ? '#1F2937' : '#fff' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
      </TooltipProvider>

    </AdminLayout>
  );
};

export default AdminDashboard;
