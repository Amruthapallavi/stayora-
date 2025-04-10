
import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Home, Plus, BookOpen, CheckCircle, UserCheck, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Sidebar from '../../components/owner/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import OwnerLayout from '../../components/owner/OwnerLayout';

interface Property {
  id: string;
  title: string;
  type: string;
  rentPerMonth: number;
  city: string;
  images: string[];
  // Mock data properties
  views?: number;
  bookings?: number;
  revenue?: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
}

const StatCard = ({ title, value, description, icon, trend, trendValue }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="h-8 w-8 rounded-full bg-golden-light/30 p-1.5 text-golden-dark">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      {trend && trendValue && (
        <div className={`flex items-center text-xs mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? '↑' : '↓'} {trendValue} from last month
        </div>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { getProperties } = useAuthStore();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeBookings: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
  });

  // Mock chart data - in a real app, this would come from an API
  const chartData = [
    { name: 'Jan', bookings: 4, revenue: 7000 },
    { name: 'Feb', bookings: 6, revenue: 9500 },
    { name: 'Mar', bookings: 5, revenue: 8000 },
    { name: 'Apr', bookings: 8, revenue: 12000 },
    { name: 'May', bookings: 7, revenue: 11000 },
    { name: 'Jun', bookings: 9, revenue: 13500 },
  ];

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await getProperties();
      setProperties(response.properties);
      
      // In a real application, you would fetch these statistics from your backend
      // Here we're just creating mock stats based on the properties
      setStats({
        totalProperties: response.properties.length,
        activeBookings: Math.floor(Math.random() * 10) + 5,
        monthlyRevenue: response.properties.reduce((total, prop) => total + prop.rentPerMonth, 0),
        occupancyRate: Math.floor(Math.random() * 40) + 60,
      });
    } catch (error) {
      console.error('Error loading properties for dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPropertyCard = (
    <div 
      onClick={() => navigate('/owner/add-property')}
      className="flex flex-col items-center justify-center h-40 bg-white rounded-lg border border-dashed border-golden-light cursor-pointer hover:bg-golden-light/10 transition-colors"
    >
      <div className="h-12 w-12 rounded-full bg-golden-light/30 flex items-center justify-center mb-4">
        <Plus className="h-6 w-6 text-golden-dark" />
      </div>
      <p className="font-medium text-golden-dark">Add New Property</p>
    </div>
  );

  if (loading) {
    return (
      <OwnerLayout>
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-t-2 border-golden rounded-full"></div>
        </div>
      </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-golden-dark mb-8">Owner Dashboard</h1>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Properties"
              value={stats.totalProperties}
              description="Properties listed on platform"
              icon={<Home className="h-5 w-5" />}
              trend="up" 
              trendValue="2"
            />
            <StatCard
              title="Active Bookings"
              value={stats.activeBookings}
              description="Currently occupied properties"
              icon={<BookOpen className="h-5 w-5" />}
              trend="up"
              trendValue="15%"
            />
            <StatCard
              title="Monthly Revenue"
              value={`$${stats.monthlyRevenue}`}
              description="Total earnings this month"
              icon={<CheckCircle className="h-5 w-5" />}
              trend="up"
              trendValue="8%"
            />
            <StatCard
              title="Occupancy Rate"
              value={`${stats.occupancyRate}%`}
              description="Average property occupancy"
              icon={<UserCheck className="h-5 w-5" />}
              trend={stats.occupancyRate > 70 ? "up" : "down"}
              trendValue="5%"
            />
          </div>

          {/* Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
                <CardDescription>Number of bookings per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#b38e5d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>Monthly revenue in USD</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#8b6b3b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Properties Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-golden-dark">Recent Properties</h2>
              <button 
                onClick={() => navigate('/owner/properties')}
                className="text-golden-dark hover:text-golden transition-colors text-sm font-medium flex items-center"
              >
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {properties.slice(0, 3).map((property) => (
                <div 
                  key={property.id}
                  onClick={() => navigate(`/property/${property.id}`)}
                  className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={property.images[0]} 
                      alt={property.title} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1 truncate">{property.title}</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{property.city}</span>
                      <span className="font-semibold text-golden">${property.rentPerMonth}/mo</span>
                    </div>
                  </div>
                </div>
              ))}
              {/* Add Property Card */}
              {addPropertyCard}
            </div>
          </div>

          {/* Alert Section */}
          {stats.occupancyRate < 70 && (
            <Card className="bg-amber-50 border-amber-200 mb-8">
              <CardContent className="p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-amber-800">Improve Your Occupancy</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Your occupancy rate is below average. Consider updating your property descriptions, 
                    adding more photos, or adjusting your pricing strategy to attract more bookings.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    </OwnerLayout>
  );
};

export default Dashboard;
