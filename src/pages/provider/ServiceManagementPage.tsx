import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { Service, Category } from '../../types';
import { PlusCircleIcon, EditIcon, DeleteIcon, BuildingStorefrontIcon } from '../../components/icons/Icons';
import api from '../../utils/api';
import { toast } from 'sonner';

// Full CRUD: GET /api/services + POST|PATCH|DELETE /api/services/:id
const ServiceManagementPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [price, setPrice] = useState<string>('');

  // Fetch provider's services + categories on mount
  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          api.get<Service[]>('/services', { params: { providerId: currentUser.id } }),
          api.get<Category[]>('/category'),
        ]);
        setServices(servicesRes.data);
        setCategories(categoriesRes.data);
      } catch { toast.error('Failed to load services.'); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, [currentUser]);

  const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }));

  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentService(null);
    setTitle('');
    setDescription('');
    setCategoryId('');
    setPrice('');
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setIsEditMode(true);
    setCurrentService(service);
    setTitle(service.title);
    setDescription(service.description);
    setCategoryId(String(service.category?.id || ''));
    setPrice(service.price.toString());
    setIsModalOpen(true);
  };

  // DELETE /api/services/:id
  const handleDeleteService = async (serviceId: number) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/${serviceId}`);
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      toast.success('Service deleted.');
    } catch { toast.error('Failed to delete service.'); }
  };

  // POST or PATCH /api/services
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !categoryId || !price) {
      toast.error('Please fill all required fields.');
      return;
    }

    const payload = {
      title,
      description,
      categoryId: parseInt(categoryId),
      price: parseFloat(price),
      providerId: currentUser!.id,
    };

    setSubmitting(true);
    try {
      if (isEditMode && currentService) {
        const { data } = await api.patch<Service>(`/services/${currentService.id}`, payload);
        setServices((prev) => prev.map((s) => (s.id === data.id ? data : s)));
        toast.success('Service updated.');
      } else {
        const { data } = await api.post<Service>('/services', payload);
        setServices((prev) => [data, ...prev]);
        toast.success('Service created.');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    } finally { setSubmitting(false); }
  };

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-poppins font-bold text-gray-800">My Services</h1>
        <Button variant="primary" size="md" leftIcon={<PlusCircleIcon className="w-5 h-5"/>} onClick={openCreateModal}>
          Create New Service
        </Button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading services...</p>
      ) : services.length === 0 ? (
        <Card className="p-8 text-center">
          <BuildingStorefrontIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Services Yet</h2>
          <p className="text-gray-500 mb-4">You haven't added any services yet.</p>
          <Button variant="primary" onClick={openCreateModal}>Create Your First Service</Button>
        </Card>
      ) : (
        <Card className="shadow-xl overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-lightGray transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{service.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{service.category?.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{service.price.toLocaleString()} FCFA</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(service)} aria-label="Edit">
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
        </Card>
      )}

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? 'Edit Service' : 'Create New Service'} size="lg">
          <form onSubmit={handleModalSubmit} className="space-y-4">
            <Input label="Service Title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <div>
              <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea id="desc" rows={4} className="w-full p-2 border border-gray-300 rounded-md" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <Select label="Category" options={categoryOptions} value={categoryId} onChange={(e) => setCategoryId(String(e.target.value))} />
            <Input label="Price (FCFA)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" isLoading={submitting}>
                {submitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Service'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ServiceManagementPage;
