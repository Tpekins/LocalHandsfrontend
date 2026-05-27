import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import { DUMMY_SERVICE_ORDERS } from '../../utils/dummyData';
import { ServiceOrder, ServiceOrderStatus } from '../../types';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import { BriefcaseIcon } from '../../components/icons/Icons';

const ActiveJobsPage: React.FC = () => {
  const { currentUser } = useAuth();

  const activeJobs = DUMMY_SERVICE_ORDERS.filter(
    order => order.clientId === currentUser?.id && 
             (order.status === ServiceOrderStatus.OPEN || order.status === ServiceOrderStatus.IN_PROGRESS)
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-poppins font-bold text-gray-800">My Active Jobs</h1>
      
      {activeJobs.length === 0 ? (
        <Card className="p-8 text-center">
          <BriefcaseIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Active Jobs</h2>
          <p className="text-gray-500 mb-4">You don't have any jobs currently open or in progress.</p>
          <Link to="/client/post-job">
            <Button variant="primary">Post a New Job</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {activeJobs.map((job: ServiceOrder) => (
            <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <h2 className="text-xl font-poppins font-semibold text-primary mb-1">{job.title}</h2>
                  <p className="text-sm text-gray-500">Category: {job.category.name}</p>
                  <p className="text-sm text-gray-500">Posted: {new Date(job.postedDate).toLocaleDateString()}</p>
                  {job.budget && <p className="text-sm text-gray-500">Budget: ${job.budget.toFixed(2)}</p>}
                </div>
                <div className="mt-4 sm:mt-0 text-left sm:text-right">
                  <span className={`px-3 py-1 inline-block rounded-full text-sm font-semibold
                    ${job.status === ServiceOrderStatus.OPEN ? 'bg-green-100 text-green-700' : ''}
                    ${job.status === ServiceOrderStatus.IN_PROGRESS ? 'bg-yellow-100 text-yellow-700' : ''}
                    ${job.status === ServiceOrderStatus.COMPLETED ? 'bg-blue-100 text-blue-700' : ''}
                    ${job.status === ServiceOrderStatus.CANCELLED ? 'bg-red-100 text-red-700' : ''}
                  `}>
                    {job.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{job.proposalsCount} Proposal(s)</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link to={`/client/my-proposals`}> {/* Or a specific job detail page */}
                  <Button variant="outline" size="sm">View Details & Proposals</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveJobsPage;
