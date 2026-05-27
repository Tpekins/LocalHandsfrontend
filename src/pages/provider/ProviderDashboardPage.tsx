
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { DUMMY_SERVICE_ORDERS, DUMMY_PROPOSALS, DUMMY_SERVICES } from '../../utils/dummyData';
import { ServiceOrder, ServiceOrderStatus } from '../../types';
import { PresentationChartLineIcon, BriefcaseIcon, BuildingStorefrontIcon, CurrencyDollarIcon, StarIcon, ChatBubbleLeftRightIcon } from '../../components/icons/Icons';

const ProviderDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();

  // Filter data for the current provider
  const providerServices = DUMMY_SERVICES.filter(s => s.providerId === currentUser?.id);
  const providerProposals = DUMMY_PROPOSALS.filter(p => p.providerId === currentUser?.id);
  
  const totalEarnings = providerProposals
    .filter(p => p.status === 'Accepted') // Simplified: assumes accepted proposals are paid
    .reduce((sum, p) => sum + (p.proposedPrice || 0), 0);

  const activeContracts = providerProposals.filter(p => {
    const job = DUMMY_SERVICE_ORDERS.find(o => o.id === p.serviceOrderId);
    return p.status === 'Accepted' && job?.status === ServiceOrderStatus.IN_PROGRESS;
  }).length;
  
  const averageRating = providerServices.length > 0 
    ? providerServices.reduce((sum, s) => sum + s.rating, 0) / providerServices.length
    : 0;

  const recentJobOpportunities = DUMMY_SERVICE_ORDERS.filter(
    order => order.status === ServiceOrderStatus.OPEN && 
             !providerProposals.some(p => p.serviceOrderId === order.id) // Show jobs provider hasn't applied to
  ).slice(0, 5);


  if (!currentUser) return <p>Loading provider data...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-poppins font-bold text-gray-800">Welcome, {currentUser.name}!</h1>

      {/* Key Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-r from-secondary to-amber-500 text-gray-800">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-4xl font-bold">${totalEarnings.toFixed(2)}</p>
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
                    <p className="text-4xl font-bold">{averageRating.toFixed(1)} <StarIcon className="w-7 h-7 inline-block mb-1 text-yellow-300"/></p>
                    <p>Average Rating</p>
                </div>
                <StarIcon className="w-12 h-12 opacity-70 text-yellow-300" />
            </div>
        </Card>
      </div>

      {/* Recent Job Opportunities */}
      <Card className="p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-poppins font-semibold text-gray-700">Recent Job Opportunities</h2>
          <Link to="/provider/browse-jobs">
            <Button variant="outline" size="sm">View All Jobs</Button>
          </Link>
        </div>
        {recentJobOpportunities.length === 0 ? (
          <p className="text-gray-500">No new job opportunities matching your profile right now. Check back later!</p>
        ) : (
          <div className="space-y-4">
            {recentJobOpportunities.map((job: ServiceOrder) => (
              <Card key={job.id} className="p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-primary hover:underline">
                      <Link to={`/provider/submit-proposal/${job.id}`}>{job.title}</Link>
                    </h3>
                    <p className="text-sm text-gray-600">{job.category.name} - By: {job.clientName}</p>
                    <p className="text-xs text-gray-500 mt-1">Posted: {new Date(job.postedDate).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-3 sm:mt-0 text-left sm:text-right">
                    {job.budget && <p className="text-lg font-semibold text-gray-700">${job.budget.toFixed(2)}</p>}
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
