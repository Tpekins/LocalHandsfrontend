import React from 'react';
import { DUMMY_SERVICE_ORDERS } from '../../utils/dummyData';
import { ServiceOrder, ServiceOrderStatus } from '../../types';
import JobCard from '../../components/JobCard';

const NewBrowseJobsPage: React.FC = () => {
  const openJobs = DUMMY_SERVICE_ORDERS.filter(
    (job: ServiceOrder) => job.status === ServiceOrderStatus.OPEN
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-poppins font-bold text-gray-800 mb-6">Browse Available Jobs</h1>
      {openJobs.length === 0 ? (
        <p className="text-center text-gray-500">No open jobs at the moment. Please check back later.</p>
      ) : (
        <div className="space-y-6">
          {openJobs.map((job: ServiceOrder) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewBrowseJobsPage;
