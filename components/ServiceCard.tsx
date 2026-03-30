
import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '../types';
import { formatCurrency } from '../utils/currency';
import Button from './Button';
import Card from './Card';
import { StarIcon } from './icons/Icons'; // Assuming you have a StarIcon

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Card className="flex flex-col h-full group">
      <div className="relative aspect-w-16 aspect-h-9">
        <img 
          src={service.images[0] || 'https://picsum.photos/400/225?random=1'} 
          alt={service.title} 
          className="object-cover w-full h-full group-hover:opacity-90 transition-opacity"
        />
        <div className="absolute top-2 right-2 bg-secondary text-gray-800 px-2 py-1 rounded-md text-xs font-semibold">
          {service.category.name}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-poppins font-semibold text-gray-800 mb-2 truncate group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        <p className="text-sm text-gray-600 mb-1">By: {service.providerName}</p>
        <div className="flex items-center mb-3 text-sm text-gray-500">
          <StarIcon filled className="w-4 h-4 text-yellow-400 mr-1" />
          <span>{(service.rating ?? 0).toFixed(1)} ({service.reviewsCount ?? 0} reviews)</span>
        </div>
        <p className="text-xs text-gray-500 mb-3 h-10 overflow-hidden line-clamp-2">
            {service.description}
        </p>
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-3">
            <p className="text-lg font-bold text-primary">{formatCurrency(service.price)}
              {service.priceType === 'hourly' && <span className="text-xs text-gray-500">/hr</span>}
            </p>
          </div>
          <Link to={`/services/${service.id}`}>
            <Button variant="primary" size="md" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
    