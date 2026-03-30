import React from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Card from '../../components/Card';
import { useAuth } from '../../contexts/AuthContext';
import { DUMMY_ADMIN_USER_DATA_CHART, DUMMY_ADMIN_SERVICES_PER_CATEGORY_CHART, DUMMY_ADMIN_CONTRACT_STATUS_CHART } from '../../utils/dummyData';
import { UsersIcon, BriefcaseIcon, ChartBarIcon } from '../../components/icons/Icons'; // Example icons

const AdminDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();

  const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (!currentUser) return <p>Loading admin data...</p>;

  const quickStats = [
    { title: 'Total Users', value: DUMMY_ADMIN_USER_DATA_CHART.reduce((acc, item) => acc + item.value, 0), icon: UsersIcon, color: 'bg-blue-500' },
    { title: 'Total Services', value: DUMMY_ADMIN_SERVICES_PER_CATEGORY_CHART.reduce((acc, item) => acc + item.value, 0), icon: BriefcaseIcon, color: 'bg-green-500' },
    { title: 'Active Contracts', value: DUMMY_ADMIN_CONTRACT_STATUS_CHART.find(c => c.name === 'In Progress')?.value || 0, icon: ChartBarIcon, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-poppins font-bold text-gray-800">Admin Dashboard</h1>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickStats.map(stat => (
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
            <LineChart data={DUMMY_ADMIN_USER_DATA_CHART} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
                labelStyle={{ color: '#333', fontWeight: 'bold' }}
              />
              <Legend />
              <Line type="monotone" dataKey="value" name="New Users" stroke="#008080" strokeWidth={2} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 shadow-xl">
          <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-4">Services per Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={DUMMY_ADMIN_SERVICES_PER_CATEGORY_CHART} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#666" angle={-30} textAnchor="end" height={50} />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
                labelStyle={{ color: '#333', fontWeight: 'bold' }}
              />
              <Legend />
              <Bar dataKey="value" name="Services" fill="#FFC107" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      
      <Card className="p-6 shadow-xl lg:col-span-2"> {/* Make Pie Chart take full width on smaller screens, or adjust layout */}
          <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-4 text-center">Contract Statuses</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={DUMMY_ADMIN_CONTRACT_STATUS_CHART}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {DUMMY_ADMIN_CONTRACT_STATUS_CHART.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
                 formatter={(value: number, name: string) => [`${value} contracts`, name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
    </div>
  );
};

export default AdminDashboardPage;
