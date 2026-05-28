import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ServiceCard from '../../components/ServiceCard';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { SearchIcon } from '../../components/icons/Icons';

const ServicesPage: React.FC = () => {
  const [servicesVersion, setServicesVersion] = useState(0);
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [sortBy, setSortBy] = useState<string>('price_asc');

  const categoryOptions = [{ value: 'all', label: 'All Categories' }];
  const sortOptions = [
    { value: 'price_asc', label: 'Price (FCFA Low to High)' },
    { value: 'price_desc', label: 'Price (FCFA High to Low)' },
    { value: 'title_asc', label: 'Title (A-Z)' },
  ];

  useEffect(() => {
    setServicesVersion(v => v + 1);
  }, []);

  const filteredAndSortedServices = useMemo(() => {
    let services: any[] = [];

    if (searchTerm) {
      services = services.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.provider.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      services = services.filter(service => service.category?.id === Number(selectedCategory));
    }

    switch (sortBy) {
      case 'price_asc':
        services = services.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        services = services.sort((a, b) => b.price - a.price);
        break;
      case 'title_asc':
        services = services.sort((a,b) => a.title.localeCompare(b.title));
        break;
    }
    return services;
  }, [searchTerm, selectedCategory, sortBy, servicesVersion]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-poppins font-bold text-gray-800 mb-8 text-center">Browse Services</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 sticky top-20 z-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="relative md:col-span-1">
            <Input
              label="Search Services"
              placeholder="e.g., Web Design, Plumbing"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              containerClassName="mb-0"
            />
            <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 mt-3" />
          </div>
          <Select
            label="Filter by Category"
            options={categoryOptions}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(String(e.target.value))}
            containerClassName="mb-0"
          />
          <Select
            label="Sort By"
            options={sortOptions}
            value={sortBy}
            onChange={(e) => setSortBy(String(e.target.value))}
            containerClassName="mb-0"
          />
        </div>
      </div>

      {filteredAndSortedServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <img src="https://via.placeholder.com/300x200/F3F4F6/9CA3AF?text=No+Services+Found" alt="No services found" className="mx-auto mb-4 rounded-lg" />
          <p className="text-xl text-gray-600">No services match your criteria.</p>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;