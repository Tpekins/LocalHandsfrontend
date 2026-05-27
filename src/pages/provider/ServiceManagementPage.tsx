import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { DUMMY_SERVICES, DUMMY_CATEGORIES } from '../../utils/dummyData';
import { Service, Category, AssetType } from '../../types';
import { PlusCircleIcon, EditIcon, DeleteIcon, BuildingStorefrontIcon } from '../../components/icons/Icons';

const ServiceManagementPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [services, setServices] = useState<Service[]>(
    DUMMY_SERVICES.filter(s => s.providerId === currentUser?.id)
  );

  React.useEffect(() => {
    setServices(DUMMY_SERVICES.filter(s => s.providerId === currentUser?.id));
  }, [currentUser, DUMMY_SERVICES.length]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>(String(DUMMY_CATEGORIES[0]?.id) || '');
  const [price, setPrice] = useState<string>('');

  const categoryOptions = DUMMY_CATEGORIES.map(cat => ({ value: String(cat.id), label: cat.name }));

  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentService({});
    setTitle('');
    setDescription('');
    setCategoryId(String(DUMMY_CATEGORIES[0]?.id) || '');
    setPrice('');
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setIsEditMode(true);
    setCurrentService(service);
    setTitle(service.title);
    setDescription(service.description);
    setCategoryId(String(service.category?.id) || '');
    setPrice(service.price.toString());
    setIsModalOpen(true);
  };

  const handleDeleteService = (serviceId: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(s => s.id !== serviceId));
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
      provider: currentUser!,
      providerId: currentUser!.id,
      title,
      description,
      category: DUMMY_CATEGORIES.find(c => c.id === Number(categoryId)) as Category,
      categoryId: parseInt(categoryId),
      price: parseFloat(price),
      status: 'available',
      featured: false,
      assets: currentService?.assets || [
        { id: Date.now(), serviceId: 0, type: AssetType.IMAGE, imageUrl: 'https://picsum.photos/seed/newservice/600/400', createdAt: new Date().toISOString() },
      ],
      views: 0,
      createdAt: new Date().toISOString(),
    };

    if (isEditMode && currentService) {
      const updatedService = { ...currentService, ...serviceData, id: currentService.id } as Service;
      setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
      const serviceIdx = DUMMY_SERVICES.findIndex(s => s.id === updatedService.id);
      if (serviceIdx > -1) DUMMY_SERVICES[serviceIdx] = updatedService;
      alert('Service updated successfully!');
    } else {
      const newService = { ...serviceData, id: Date.now() } as Service;
      setServices(prev => [newService, ...prev]);
      DUMMY_SERVICES.unshift(newService);
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
                    <div className="text-sm text-gray-500">{service.category?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{price} FCFA</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
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
            </div>
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