import React from 'react';
import { Link } from 'react-router-dom';
import { ServiceOrder } from '../types';
import { truncateText, formatDate } from '../utils/helpers';
import { formatCurrency } from '../utils/currency';
import Button from './Button';
import Card from './Card';

interface JobCardProps {
  job: ServiceOrder;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Card key={job.id} className="p-4 hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col sm:flex-row items-start sm:space-x-4">
      {/* Image Section */}
      <div className="w-full sm:w-48 flex-shrink-0">
        <img
          src={job.service.assets[0]?.imageUrl || 'https://picsum.photos/400/300?random=job'}
          alt={job.service.category?.name || 'Service image'}
          className="object-cover w-full h-40 sm:h-full rounded-lg"
        />
      </div>

      {/* Details Section */}
      <div className="flex-grow mt-4 sm:mt-0 w-full">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{job.service.category?.name}</p>
            <h2 className="text-xl font-poppins font-semibold text-primary mb-1 group">
              <Link to={`/provider/submit-proposal/${job.id}`} className="hover:underline group-hover:text-accent">
                {job.service.title}
              </Link>
            </h2>
            <p className="text-sm text-gray-600">Client: {job.client.name}</p>
            <p className="text-xs text-gray-400">Posted: {formatDate(job.createdAt)}</p>
          </div>
          <div className="mt-4 sm:mt-0 text-left sm:text-right flex-shrink-0">
            {job.budget && <p className="text-lg font-semibold text-gray-800">{formatCurrency(job.budget)}</p>}
            <Link to={`/provider/submit-proposal/${job.id}`}>
              <Button variant="primary" size="md">View & Apply</Button>
            </Link>
          </div>
        </div>
        <p className="text-gray-700 mt-3 pt-3 border-t border-gray-200 line-clamp-2 leading-relaxed">
          {truncateText(job.description, 120)}
        </p>
      </div>
    </Card>
  );
};

export default JobCard;
