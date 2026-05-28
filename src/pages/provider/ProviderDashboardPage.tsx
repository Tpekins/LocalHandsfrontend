import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ServiceOrder, Proposal, Service } from '../../types';
import { PresentationChartLineIcon, BriefcaseIcon, BuildingStorefrontIcon, CurrencyDollarIcon } from '../../components/icons/Icons';
import api from '../../utils/api';

const ProviderDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [recentJobs, setRecentJobs] = useState<ServiceOrder[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const fetchDashboard = async () => {
      try {
        // Fetch in parallel: open jobs, my proposals, my services
        const [jobsRes, proposalsRes, servicesRes] = await Promise.all([
          api.get<ServiceOrder[]>('/serviceorder', { params: { status: 'PENDING' } }),
          api.get<Proposal[]>('/proposal', { params: { providerId: currentUser.id } }),
          api.get<Service[]>('/services', { params: { providerId: currentUser.id } }),
        ]);
        setRecentJobs(jobsRes.data.slice(0, 5)); // limit to 5 for dashboard
        setProposals(proposalsRes.data);
        setServices(servicesRes.data);
      } catch { /* degrade gracefully */ }
      finally { setIsLoading(false); }
    };
    fetchDashboard();
  }, [currentUser]);

  // Calculate stats from live data
  const activeContracts = proposals.filter((p) => p.status === 'ACCEPTED').length;
  const acceptedTotal = proposals
    .filter((p) => p.status === 'ACCEPTED')
    .reduce((sum, p) => sum + p.bidAmount, 0);

  if (!currentUser) return <p>Loading provider data...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-poppins font-bold text-gray-800">Welcome, {currentUser.name}!</h1>

      {/* Stat cards — populated from API data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-r from-secondary to-amber-500 text-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold">{acceptedTotal.toLocaleString()} FCFA</p>
              <p>Total Earnings</p>
            </div>
            <CurrencyDollarIcon className="w-12 h-12 opacity-70" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-r from-primary to-teal-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold">{activeContracts}</p>
              <p>Active Contracts</p>
            </div>
            <BriefcaseIcon className="w-12 h-12 opacity-70" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-r from-gray-700 to-gray-800 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold">{services.length}</p>
              <p>Total Services</p>
            </div>
            <BuildingStorefrontIcon className="w-12 h-12 opacity-70" />
          </div>
        </Card>
      </div>

      {/* Recent job opportunities */}
      <Card className="p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-poppins font-semibold text-gray-700">Recent Job Opportunities</h2>
          <Link to="/provider/browse-jobs"><Button variant="outline" size="sm">View All Jobs</Button></Link>
        </div>
        {isLoading ? (
          <p className="text-gray-500">Loading opportunities...</p>
        ) : recentJobs.length === 0 ? (
          <p className="text-gray-500">No new job opportunities matching your profile right now.</p>
        ) : (
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <Card key={job.id} className="p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-primary hover:underline">
                      <Link to={`/provider/submit-proposal/${job.id}`}>{job.service?.title || 'Untitled'}</Link>
                    </h3>
                    <p className="text-sm text-gray-600">{job.service?.category?.name} — By: {job.client?.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-3 sm:mt-0 text-left sm:text-right">
                    {job.budget && <p className="text-lg font-semibold text-gray-700">{job.budget.toLocaleString()} FCFA</p>}
                    <Link to={`/provider/submit-proposal/${job.id}`}>
                      <Button variant="primary" size="sm" className="mt-1">View & Apply</Button>
                    </Link>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{job.description}</p>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-3">Manage Your Services</h2>
          <p className="text-gray-600 mb-4">Keep your service offerings up-to-date to attract more clients.</p>
          <Link to="/provider/service-management">
            <Button variant="primary" leftIcon={<BuildingStorefrontIcon className="w-5 h-5"/>}>My Services</Button>
          </Link>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-3">Review Your Proposals</h2>
          <p className="text-gray-600 mb-4">Track the status of proposals you've sent to clients.</p>
          <Link to="/provider/proposals">
            <Button variant="primary" leftIcon={<PresentationChartLineIcon className="w-5 h-5"/>}>Sent Proposals</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default ProviderDashboardPage;
