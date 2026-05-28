import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Card from '../../components/Card';
import { useAuth } from '../../contexts/AuthContext';
import { UsersIcon, BriefcaseIcon, ChartBarIcon } from '../../components/icons/Icons';
import { User, Service, ServiceOrder } from '../../types';
import api from '../../utils/api';

/*
 * AdminDashboardPage — aggregates stats from multiple endpoints
 *
 * GET /api/user         → total user count + new user registration trend
 * GET /api/services     → total service count + per-category breakdown
 * GET /api/serviceorder → contract status distribution for pie chart
 */

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [activeContracts, setActiveContracts] = useState(0);
  const [userTrend, setUserTrend] = useState<{ name: string; value: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);
  const [contractData, setContractData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, servicesRes, ordersRes] = await Promise.all([
          api.get<User[]>('/user'),
          api.get<Service[]>('/services'),
          api.get<ServiceOrder[]>('/serviceorder'),
        ]);

        const users = usersRes.data;
        const services = servicesRes.data;
        const orders = ordersRes.data;

        /* Count totals */
        setTotalUsers(users.length);
        setTotalServices(services.length);
        setActiveContracts(orders.filter((o) => o.status === 'PENDING' || o.status === 'ACCEPTED').length);

        /* User registration trend — group users by month */
        const monthlyUsers: Record<string, number> = {};
        users.forEach((u) => {
          const month = new Date(u.createdAt).toLocaleString('default', { month: 'short' });
          monthlyUsers[month] = (monthlyUsers[month] || 0) + 1;
        });
        setUserTrend(Object.entries(monthlyUsers).map(([name, value]) => ({ name, value })));

        /* Services per category */
        const perCategory: Record<string, number> = {};
        services.forEach((s) => {
          const cat = s.category?.name || 'Uncategorized';
          perCategory[cat] = (perCategory[cat] || 0) + 1;
        });
        setCategoryData(Object.entries(perCategory).map(([name, value]) => ({ name, value })));

        /* Contract status distribution */
        const byStatus: Record<string, number> = {};
        orders.forEach((o) => {
          byStatus[o.status] = (byStatus[o.status] || 0) + 1;
        });
        setContractData(Object.entries(byStatus).map(([name, value]) => ({ name, value })));
      } catch {
        /* charts remain empty */
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (!currentUser) return <p>Loading admin data...</p>;

  const quickStats = [
    { title: 'Total Users', value: totalUsers, icon: UsersIcon, color: 'bg-blue-500' },
    { title: 'Total Services', value: totalServices, icon: BriefcaseIcon, color: 'bg-green-500' },
    { title: 'Active Orders', value: activeContracts, icon: ChartBarIcon, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-poppins font-bold text-gray-800">Admin Dashboard</h1>

      {loading ? (
        <p className="text-gray-500">Loading dashboard data...</p>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickStats.map((stat) => (
              <Card key={stat.title} className={`p-6 text-white shadow-lg ${stat.color}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold">{stat.value}</p>
                    <p>{stat.title}</p>
                  </div>
                  {stat.icon && <stat.icon className="w-12 h-12 opacity-80" />}
                </div>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6 shadow-xl">
              <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-4">New Users Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userTrend} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="New Users" stroke="#008080" strokeWidth={2} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 shadow-xl">
              <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-4">Services per Category</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" stroke="#666" angle={-30} textAnchor="end" height={60} />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }} />
                  <Legend />
                  <Bar dataKey="value" name="Services" fill="#FFC107" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6 shadow-xl">
            <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-4 text-center">Contract Status Distribution</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={contractData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} outerRadius={120} fill="#8884d8" dataKey="value">
                  {contractData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }} formatter={(value: number, name: string) => [`${value} orders`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
