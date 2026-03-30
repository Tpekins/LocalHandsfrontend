
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { DUMMY_SERVICES, DUMMY_CATEGORIES } from '../../utils/dummyData';
import { Service, Category } from '../../types';
import { PlusCircleIcon, EditIcon, DeleteIcon, BuildingStorefrontIcon } from '../../components/icons/Icons';

const ServiceManagementPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [services, setServices] = useState<Service[]>(
    DUMMY_SERVICES.filter(s => s.providerId === currentUser?.id)
  );

  // Sync services state with DUMMY_SERVICES when currentUser or DUMMY_SERVICES changes
  React.useEffect(() => {
    setServices(DUMMY_SERVICES.filter(s => s.providerId === currentUser?.id));
  }, [currentUser, DUMMY_SERVICES.length]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null); // For create/edit
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state for modal
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>(DUMMY_CATEGORIES[0]?.id || '');
  const [price, setPrice] = useState<string>('');
  const [priceType, setPriceType] = useState<'fixed' | 'hourly' | 'negotiable'>('fixed');

  const categoryOptions = DUMMY_CATEGORIES.map(cat => ({ value: cat.id, label: cat.name }));
  const priceTypeOptions = [
    { value: 'fixed', label: 'Fixed Price' },
    { value: 'hourly', label: 'Hourly Rate' },
    { value: 'negotiable', label: 'Negotiable' },
  ];

  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentService({});
    setTitle('');
    setDescription('');
    setCategoryId(DUMMY_CATEGORIES[0]?.id || '');
    setPrice('');
    setPriceType('fixed');
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setIsEditMode(true);
    setCurrentService(service);
    setTitle(service.title);
    setDescription(service.description);
    setCategoryId(service.category.id);
    setPrice(service.price.toString());
    setPriceType(service.priceType);
    setIsModalOpen(true);
  };

  const handleDeleteService = (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      // Simulate API call
      setServices(prev => prev.filter(s => s.id !== serviceId));
      // Also update DUMMY_SERVICES if it's meant to be persistent in demo
      const serviceIdx = DUMMY_SERVICES.findIndex(s => s.id === serviceId);
      if (serviceIdx > -1) DUMMY_SERVICES.splice(serviceIdx, 1);
      alert('Service deleted successfully.');
    }
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !categoryId || !price) {
        alert("Please fill all required fields.");
        return;
    }

    const serviceData = {
      providerId: currentUser!.id,
      providerName: currentUser!.name,
      title,
      description,
      category: DUMMY_CATEGORIES.find(c => c.id === categoryId) as Category,
      price: parseFloat(price),
      priceType,
      images: currentService?.images || ['https://picsum.photos/seed/newservice/600/400'],
    };

    if (isEditMode && currentService) {
      // Update existing service
      const updatedService = { ...currentService, ...serviceData, id: currentService.id } as Service;
      setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
      // Update DUMMY_SERVICES
      const serviceIdx = DUMMY_SERVICES.findIndex(s => s.id === updatedService.id);
      if (serviceIdx > -1) DUMMY_SERVICES[serviceIdx] = updatedService;
      alert('Service updated successfully!');
    } else {
      const newService = { ...serviceData, id: `service-${Date.now()}` } as Service;
      setServices(prev => [newService, ...prev]);
      DUMMY_SERVICES.unshift(newService); // Add to global dummy data
      alert('Service created successfully!');
    }
    setIsModalOpen(false);
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

      {services.length === 0 ? (
        <Card className="p-8 text-center">
          <BuildingStorefrontIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Services Yet</h2>
          <p className="text-gray-500 mb-4">You haven't added any services yet. Create one to start offering it to clients.</p>
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
              {services.map(service => (
                <tr key={service.id} className="hover:bg-lightGray transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{service.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{service.category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${service.price.toFixed(2)} ({service.priceType})</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active {/* Placeholder status */}
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
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={isEditMode ? 'Edit Service' : 'Create New Service'}
          size="lg"
        >
          <form onSubmit={handleModalSubmit} className="space-y-4">
            <Input label="Service Title" name="title" value={title} onChange={e => setTitle(e.target.value)} required />
            <div>
              <label htmlFor="descriptionModal" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea id="descriptionModal" name="description" rows={4} className="w-full p-2 border border-gray-300 rounded-md" value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <Select label="Category" name="categoryModal" options={categoryOptions} value={categoryId} onChange={e => setCategoryId(String(e.target.value))} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Price (FCFA)" name="priceModal" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
              <Select label="Price Type" name="priceTypeModal" options={priceTypeOptions} value={priceType} onChange={e => setPriceType(String(e.target.value) as 'fixed' | 'hourly' | 'negotiable')} />
            </div>
            {/* Image upload placeholder */}
            {/* <Input label="Image URL (optional)" name="imageUrl" placeholder="https://example.com/image.png" /> */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">{isEditMode ? 'Save Changes' : 'Create Service'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ServiceManagementPage;
