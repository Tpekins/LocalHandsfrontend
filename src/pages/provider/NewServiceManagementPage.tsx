import React from 'react';
import { DUMMY_SERVICES } from '../../utils/dummyData';
import { Service } from '../../types';
import ServiceCard from '../../components/ServiceCard';
import Button from '../../components/Button';
import { PlusIcon } from '../../components/icons/Icons';

const NewServiceManagementPage: React.FC = () => {
  // In a real app, you'd filter services by the current provider's ID
  const providerServices = DUMMY_SERVICES;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-poppins font-bold text-gray-800">Manage Your Services</h1>
        <Button>
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Service
        </Button>
      </div>

      {providerServices.length === 0 ? (
        <div className="text-center py-12 px-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">No services found.</h2>
          <p className="text-gray-500 mt-2">Get started by adding your first service!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providerServices.map((service: Service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewServiceManagementPage;
