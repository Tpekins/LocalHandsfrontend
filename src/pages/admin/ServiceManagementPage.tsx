
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { Service } from '../../types';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { EditIcon, DeleteIcon, EyeIcon } from '../../components/icons/Icons';
import { formatCurrency } from '../../utils/currency';
import Modal from '../../components/Modal';
import ServiceForm from '../../components/ServiceForm';
import api from '../../utils/api';
import { toast } from 'sonner';

/*
 * AdminServiceManagementPage — GET /api/services + PATCH/DELETE
 *
 * Lists all platform services. Admin can view details, update featured
 * status/price, or delete a service. All mutations go through the API.
 */

const AdminServiceManagementPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | null>(null);
  const [loading, setLoading] = useState(true);

  /* GET /api/services — all services */
  useEffect(() => {
    api.get<Service[]>('/services')
      .then(({ data }) => setServices(data))
      .catch(() => toast.error('Failed to load services.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.provider?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.category?.name ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewService = (service: Service) => { setSelectedService(service); setModalMode('view'); };
  const handleEditService = (service: Service) => { setSelectedService(service); setModalMode('edit'); };

  /* DELETE /api/services/:id */
  const handleDeleteService = async (serviceId: number) => {
    if (!window.confirm('Delete this service from the platform?')) return;
    try {
      await api.delete(`/services/${serviceId}`);
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      toast.success('Service deleted.');
    } catch { toast.error('Failed to delete service.'); }
  };

  if (loading) {
    return <div className="space-y-8"><h1 className="text-3xl font-poppins font-bold text-gray-800">Platform Service Management</h1><p className="text-gray-500">Loading services...</p></div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-poppins font-bold text-gray-800">Platform Service Management</h1>
      <Card className="p-4 shadow-md">
        <Input placeholder="Search services (title, provider, category)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} containerClassName="mb-0" />
      </Card>

      <Card className="shadow-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredServices.map((service) => (
              <tr key={service.id} className="hover:bg-lightGray transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.provider?.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.category?.name ?? 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(service.price)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewService(service)} aria-label="View">
                    <EyeIcon className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEditService(service)} aria-label="Edit">
                    <EditIcon className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteService(service.id)} aria-label="Delete">
                    <DeleteIcon className="w-5 h-5 text-red-600 hover:text-red-800" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredServices.length === 0 && <p className="text-center py-8 text-gray-500">No services found matching your criteria.</p>}
      </Card>

      <Modal
        isOpen={!!modalMode}
        onClose={() => { setSelectedService(null); setModalMode(null); }}
        title={modalMode === 'edit' ? 'Edit Service' : 'View Service'}
        size="md"
      >
        {selectedService && (
          <ServiceForm
            service={selectedService}
            onSave={async (data) => {
              if (modalMode === 'edit') {
                try {
                  const { data: updated } = await api.patch<Service>(`/services/${selectedService.id}`, data);
                  setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
                  toast.success('Service updated.');
                } catch { toast.error('Failed to update service.'); }
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
