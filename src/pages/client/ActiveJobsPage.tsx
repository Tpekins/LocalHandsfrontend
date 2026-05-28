import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { ServiceOrder, ServiceOrderStatus } from '../../types';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import { BriefcaseIcon } from '../../components/icons/Icons';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

/*
 * ActiveJobsPage – GET /api/serviceorder?clientId={currentUser.id}
 *
 * Data flow:
 *   On mount → api.get("/serviceorder", { params: { clientId: currentUser.id } })
 *     → Backend filters ServiceOrder by clientId (added in Phase 0 fix)
 *     → Returns service orders with included service + client relations
 *   Displays each job with status badge, budget, and link to proposals
 */
const ActiveJobsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeJobs, setActiveJobs] = useState<ServiceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!currentUser) return;
      try {
        setIsLoading(true);
        setError(null);

        const { data } = await api.get<ServiceOrder[]>('/serviceorder', {
          params: { clientId: currentUser.id },
        });
        setActiveJobs(data);
      } catch (err: any) {
        setError('Failed to load your jobs.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-poppins font-bold text-gray-800">My Active Jobs</h1>
        <p className="text-gray-500">Loading your jobs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-poppins font-bold text-gray-800">My Active Jobs</h1>

      {error && <p className="text-red-500">{error}</p>}

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
          {activeJobs.map((job) => (
            <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <h2 className="text-xl font-poppins font-semibold text-primary mb-1">
                    {job.service?.title || 'Untitled Job'}
                  </h2>
                  <p className="text-sm text-gray-500">Category: {job.service?.category?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
                  {job.budget && <p className="text-sm text-gray-500">Budget: {job.budget.toLocaleString()} FCFA</p>}
                </div>
                <div className="mt-4 sm:mt-0 text-left sm:text-right">
                  <span
                    className={`px-3 py-1 inline-block rounded-full text-sm font-semibold
                    ${job.status === ServiceOrderStatus.PENDING ? 'bg-green-100 text-green-700' : ''}
                    ${job.status === ServiceOrderStatus.ACCEPTED ? 'bg-yellow-100 text-yellow-700' : ''}
                    ${job.status === ServiceOrderStatus.COMPLETED ? 'bg-blue-100 text-blue-700' : ''}
                    ${job.status === ServiceOrderStatus.REJECTED ? 'bg-red-100 text-red-700' : ''}
                  `}
                  >
                    {job.status}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link to="/client/my-proposals">
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
