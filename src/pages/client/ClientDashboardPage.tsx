
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { ServiceOrder, Proposal, ServiceOrderStatus } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { PlusCircleIcon, BriefcaseIcon, InboxIcon } from '../../components/icons/Icons';
import api from '../../utils/api';

/*
 * ClientDashboardPage – GET /api/serviceorder?clientId= + GET /api/proposal?providerId=
 *
 * Data flow:
 *   On mount → api.get("/serviceorder", { params: { clientId: currentUser.id } }) for active jobs
 *   On mount → api.get("/proposal") for proposals received on client's jobs
 *     → Proposals are filtered client-side to show only those on the client's service orders
 *
 * Stats cards show: active job count, pending proposal count, completed job count.
 * Below: list of active jobs and recent proposals received.
 */
const ClientDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeJobs, setActiveJobs] = useState<ServiceOrder[]>([]);
  const [allProposals, setAllProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!currentUser) return;
      try {
        setIsLoading(true);

        // → Fetch client's service orders
        const ordersRes = await api.get<ServiceOrder[]>('/serviceorder', {
          params: { clientId: currentUser.id },
        });
        const orders = ordersRes.data;
        setActiveJobs(orders);

        // → Fetch all proposals, then filter client-side for those on client's jobs
        const proposalsRes = await api.get<Proposal[]>('/proposal');
        const clientServiceIds = orders.map((o) => o.id);
        const clientProposals = proposalsRes.data.filter((p) =>
          clientServiceIds.includes(p.serviceId)
        );
        setAllProposals(clientProposals);
      } catch (err) {
        // Dashboard degrades gracefully — zero counts
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [currentUser]);

  const completedJobs = activeJobs.filter((j) => j.status === ServiceOrderStatus.COMPLETED).length;
  const pendingProposals = allProposals.filter((p) => p.status === 'PENDING').length;

  if (!currentUser) {
    return <p>Loading client data...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-poppins font-bold text-gray-800">Welcome back, {currentUser.name}!</h1>
        <Link to="/client/post-job">
          <Button variant="primary" size="lg" leftIcon={<PlusCircleIcon className="w-5 h-5" />}>
            Post a New Job
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-r from-primary to-teal-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold">{activeJobs.length}</p>
              <p className="text-teal-100">Active Job Postings</p>
            </div>
            <BriefcaseIcon className="w-12 h-12 opacity-70" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-secondary to-amber-500 text-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold">{pendingProposals}</p>
              <p>Pending Proposals</p>
            </div>
            <InboxIcon className="w-12 h-12 opacity-70" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-gray-700 to-gray-800 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold">{completedJobs}</p>
              <p>Completed Jobs</p>
            </div>
            <BriefcaseIcon className="w-12 h-12 opacity-70" />
          </div>
        </Card>
      </div>

      {/* Recent Active Jobs */}
      <Card className="p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-poppins font-semibold text-gray-700">Your Active Jobs</h2>
          <Link to="/client/active-jobs">
            <Button variant="outline" size="sm">View All Active Jobs</Button>
          </Link>
        </div>
        {isLoading ? (
          <p className="text-gray-500">Loading jobs...</p>
        ) : activeJobs.length === 0 ? (
          <p className="text-gray-500">You have no active job postings.</p>
        ) : (
          <div className="space-y-4">
            {activeJobs.slice(0, 5).map((job) => (
              <Card key={job.id} className="p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-primary hover:underline">
                      <Link to="/client/my-proposals">{job.service?.title || 'Untitled'}</Link>
                    </h3>
                    <p className="text-sm text-gray-600">{job.service?.category?.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-3 sm:mt-0 text-left sm:text-right">
                    <span
                      className={`px-2 py-0.5 inline-block rounded-full text-xs font-semibold
                      ${job.status === ServiceOrderStatus.PENDING ? 'bg-green-100 text-green-700' : ''}
                      ${job.status === ServiceOrderStatus.ACCEPTED ? 'bg-yellow-100 text-yellow-700' : ''}
                    `}
                    >
                      {job.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">Proposals available</p>
                    <Link to="/client/my-proposals">
                      <Button variant="ghost" size="sm" className="mt-1 text-primary hover:text-accent">View Proposals</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Proposals Received */}
      <Card className="p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-poppins font-semibold text-gray-700">Recent Proposals Received</h2>
          <Link to="/client/my-proposals">
            <Button variant="outline" size="sm">View All Proposals</Button>
          </Link>
        </div>
        {isLoading ? (
          <p className="text-gray-500">Loading proposals...</p>
        ) : allProposals.length === 0 ? (
          <p className="text-gray-500">You have no new proposals for your jobs.</p>
        ) : (
          <div className="space-y-4">
            {allProposals.slice(0, 5).map((proposal) => (
              <Card key={proposal.id} className="p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Proposal for: <span className="font-medium text-gray-700">{proposal.service?.title || 'Unknown service'}</span>
                    </p>
                    <h3 className="text-md font-semibold text-gray-800">From: {proposal.provider?.name || 'Unknown provider'}</h3>
                    <p className="text-xs text-gray-500">Received: {new Date(proposal.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-primary">{formatCurrency(proposal.bidAmount)}</p>
                    <Link to="/client/my-proposals">
                      <Button variant="ghost" size="sm" className="mt-1 text-primary hover:text-accent">View Details</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ClientDashboardPage;
