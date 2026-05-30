import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { CalendarIcon, TagIcon } from '../../components/icons/Icons';
import { ServiceOrder } from '../../types';
import api from '../../utils/api';

// GET /api/serviceorder/:id
const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<ServiceOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;
    api.get<ServiceOrder>(`/serviceorder/${jobId}`)
      .then(({ data }) => setJob(data))
      .catch((err) => setError(err.response?.data?.message || 'Job not found.'))
      .finally(() => setIsLoading(false));
  }, [jobId]);

  if (isLoading) {
    return <p className="text-center py-10 text-gray-500">Loading job details...</p>;
  }

  if (error || !job) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-700">{error || 'Job not found'}</h2>
        <Link to="/provider/browse-jobs">
          <Button variant="primary" className="mt-4">Back to Browse Jobs</Button>
        </Link>
      </div>
    );
  }

  const client = job.client;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/provider/browse-jobs" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to all jobs
        </Link>
      </div>
      <Card className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <span className="inline-block bg-blue-100 text-primary text-sm font-semibold px-3 py-1 rounded-full mb-3">
              {job.service?.category?.name || 'Uncategorized'}
            </span>
            <h1 className="text-3xl font-poppins font-bold text-gray-800 mb-4">{job.service?.title || 'Untitled'}</h1>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          <div className="md:col-span-1">
            <Card className="bg-lightGray p-5 space-y-4">
              <h3 className="text-lg font-poppins font-semibold text-gray-800 border-b pb-3">Job Overview</h3>
              <div className="flex items-center text-gray-700">
                <CalendarIcon className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Posted On</p>
                  <p className="font-semibold">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {job.budget && (
                <div className="flex items-center text-gray-700">
                  <TagIcon className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="font-semibold text-green-600">{job.budget.toLocaleString()} FCFA</p>
                  </div>
                </div>
              )}
              <div className="pt-4">
                <Link to={`/provider/submit-proposal/${job.id}`} className="w-full">
                  <Button variant="primary" size="lg" className="w-full">Submit a Proposal</Button>
                </Link>
              </div>
            </Card>

            {client && (
              <Card className="bg-lightGray p-5 mt-6">
                <h3 className="text-lg font-poppins font-semibold text-gray-800 mb-3">About the Client</h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold mr-4">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{client.name}</p>
                    <p className="text-sm text-gray-500">Member since {new Date(client.createdAt).getFullYear()}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default JobDetailsPage;
