
import React, { useState } from 'react';
import Card from '../../components/Card';
import { DUMMY_SERVICES } from '../../utils/dummyData';
import { Service } from '../../types';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { EditIcon, DeleteIcon, EyeIcon } from '../../components/icons/Icons';
import { formatCurrency } from '../../utils/currency';
import Modal from '../../components/Modal';
import ServiceForm from '../../components/ServiceForm';

const AdminServiceManagementPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>(DUMMY_SERVICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | null>(null);

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewService = (service: Service) => {
    setSelectedService(service);
    setModalMode('view');
  };
  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setModalMode('edit');
  };
  const handleDeleteService = (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service from the platform? This action might be irreversible.')) {
        setServices(prev => prev.filter(s => s.id !== serviceId));
        // Update DUMMY_SERVICES as well for demo persistence
        const serviceIdx = DUMMY_SERVICES.findIndex(s => s.id === serviceId);
        if (serviceIdx > -1) DUMMY_SERVICES.splice(serviceIdx, 1);
        alert('Service deleted by admin.');
    }
  };


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-poppins font-bold text-gray-800">Platform Service Management</h1>
       <Card className="p-4 shadow-md">
        <Input 
            placeholder="Search services (title, provider, category)..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            containerClassName="mb-0"
        />
      </Card>

      <Card className="shadow-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredServices.map(service => (
              <tr key={service.id} className="hover:bg-lightGray transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.providerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(service.price)}{service.priceType === 'hourly' ? ' /hr' : ''}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.rating.toFixed(1)} ({service.reviewsCount} reviews)</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewService(service)} aria-label="View">
                        <EyeIcon className="w-5 h-5 text-gray-600 hover:text-gray-800"/>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditService(service)} aria-label="Edit Flags/Visibility">
                        <EditIcon className="w-5 h-5 text-blue-600 hover:text-blue-800"/>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteService(service.id)} aria-label="Delete">
                        <DeleteIcon className="w-5 h-5 text-red-600 hover:text-red-800"/>
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
         {filteredServices.length === 0 && (
            <p className="text-center py-8 text-gray-500">No services found matching your criteria.</p>
        )}
      </Card>
      {/* Service View/Edit Modal */}
      <Modal
        isOpen={!!modalMode}
        onClose={() => { setSelectedService(null); setModalMode(null); }}
        title={modalMode === 'edit' ? 'Edit Service' : 'View Service'}
        size="md"
      >
        {selectedService && (
          <ServiceForm
            service={selectedService}
            onSave={(data) => {
              if (modalMode === 'edit') {
                setServices(prev => prev.map(s => s.id === selectedService.id ? { ...s, ...data } : s));
              }
              setSelectedService(null);
              setModalMode(null);
            }}
            onCancel={() => { setSelectedService(null); setModalMode(null); }}
            readOnly={modalMode === 'view'}
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminServiceManagementPage;
