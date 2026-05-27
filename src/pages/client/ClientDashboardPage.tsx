
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { DUMMY_SERVICE_ORDERS, DUMMY_PROPOSALS } from '../../utils/dummyData';
import { ServiceOrder, Proposal, ServiceOrderStatus } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { PlusCircleIcon, BriefcaseIcon, InboxIcon } from '../../components/icons/Icons'; // CheckCircleIcon removed as it's not directly used here

const ClientDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Filter data for the current client
  const activeJobs = DUMMY_SERVICE_ORDERS.filter(
    order => order.clientId === currentUser?.id && 
             (order.status === ServiceOrderStatus.OPEN || order.status === ServiceOrderStatus.IN_PROGRESS)
  ).slice(0, 3); // Show a few recent ones

  const recentProposals = DUMMY_PROPOSALS.filter(
    proposal => {
        const job = DUMMY_SERVICE_ORDERS.find(o => o.id === proposal.serviceOrderId);
        return job?.clientId === currentUser?.id && proposal.status === 'Pending';
    }
  ).slice(0,3);

  if (!currentUser) {
    return <p>Loading client data...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-poppins font-bold text-gray-800">Welcome back, {currentUser.name}!</h1>
        <Link to="/client/post-job">
          <Button variant="primary" size="lg" leftIcon={<PlusCircleIcon className="w-5 h-5"/>}>
            Post a New Job
          </Button>
        </Link>
      </div>

      {/* Quick Stats/Summary Widgets */}
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
                    <p className="text-4xl font-bold">{recentProposals.length}</p>
                    <p>Pending Proposals</p>
                </div>
                <InboxIcon className="w-12 h-12 opacity-70" />
            </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-gray-700 to-gray-800 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-4xl font-bold">
                        {DUMMY_SERVICE_ORDERS.filter(order => order.clientId === currentUser?.id && order.status === ServiceOrderStatus.COMPLETED).length}
                    </p>
                    <p>Completed Jobs</p>
                </div>
                 {/* Using BriefcaseIcon as a placeholder, replace with CheckCircleIcon if it's visually preferred and added */}
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
        {activeJobs.length === 0 ? (
          <p className="text-gray-500">You have no active job postings.</p>
        ) : (
          <div className="space-y-4">
            {activeJobs.map((job: ServiceOrder) => (
              <Card key={job.id} className="p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-primary hover:underline">
                      {/* Assuming a job detail page might be /client/jobs/:jobId or similar for clients */}
                      <Link to={`/client/my-proposals`}>{job.title}</Link> 
                    </h3>
                    <p className="text-sm text-gray-600">{job.category.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Posted: {new Date(job.postedDate).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-3 sm:mt-0 text-left sm:text-right">
                    <span className={`px-2 py-0.5 inline-block rounded-full text-xs font-semibold
                      ${job.status === ServiceOrderStatus.OPEN ? 'bg-green-100 text-green-700' : ''}
                      ${job.status === ServiceOrderStatus.IN_PROGRESS ? 'bg-yellow-100 text-yellow-700' : ''}
                    `}>
                      {job.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{job.proposalsCount} Proposal(s)</p>
                    <Link to={`/client/my-proposals`}> {/* Direct link to proposals for this job or general proposals page */}
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
        {recentProposals.length === 0 ? (
          <p className="text-gray-500">You have no new proposals for your jobs.</p>
        ) : (
          <div className="space-y-4">
            {recentProposals.map((proposal: Proposal) => {
                const jobForProposal = DUMMY_SERVICE_ORDERS.find(o => o.id === proposal.serviceOrderId);
                return (
                    <Card key={proposal.id} className="p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Proposal for: <span className="font-medium text-gray-700">{jobForProposal?.title}</span></p>
                                <h3 className="text-md font-semibold text-gray-800">From: {proposal.providerName}</h3>
                                <p className="text-xs text-gray-500">Received: {new Date(proposal.submittedDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                {proposal.proposedPrice && <p className="text-lg font-semibold text-primary">{formatCurrency(proposal.proposedPrice)}</p>}
                                 <Link to={`/client/my-proposals`}> {/* Link to page where proposal can be viewed */}
                                    <Button variant="ghost" size="sm" className="mt-1 text-primary hover:text-accent">View Details</Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                );
            })}
          </div>
        )}
      </Card>

    </div>
  );
};

export default ClientDashboardPage;
