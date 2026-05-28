import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ServiceCard from '../../components/ServiceCard';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { SearchIcon } from '../../components/icons/Icons';
import api from '../../utils/api';
import { Service, Category } from '../../types';

/*
 * ServicesPage – GET /api/services [?categoryId=&status=]
 *
 * Data flow:
 *   On mount → api.get("/api/services") fetches all available services
 *   On mount → api.get("/api/category") fetches category list for filter dropdown
 *   Query params from URL (e.g. /services?category=3) pre-select the filter
 *
 * Client-side filtering/search/sort works on the fetched array.
 * Each ServiceCard links to /services/:id for the detail page.
 */
const ServicesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [sortBy, setSortBy] = useState<string>('price_asc');

  // Fetch services and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Parallel fetch: services + categories
        const [servicesRes, categoriesRes] = await Promise.all([
          api.get<Service[]>('/services', { params: { status: 'available' } }),
          api.get<Category[]>('/category'),
        ]);

        setServices(servicesRes.data);
        setCategories(categoriesRes.data);

        // Build category filter options
        categoryOptions.length = 0;
        categoryOptions.push({ value: 'all', label: 'All Categories' });
        categoriesRes.data.forEach((cat) => {
          categoryOptions.push({ value: String(cat.id), label: cat.name });
        });
      } catch (err: any) {
        setError('Failed to load services. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync selectedCategory when URL param changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Dynamic category options (rebuilt when categories load)
  const categoryOptions: { value: string; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((cat) => ({
      value: String(cat.id),
      label: cat.name,
    })),
  ];

  const sortOptions = [
    { value: 'price_asc', label: 'Price (FCFA Low to High)' },
    { value: 'price_desc', label: 'Price (FCFA High to Low)' },
    { value: 'title_asc', label: 'Title (A-Z)' },
  ];

  const filteredAndSortedServices = useMemo(() => {
    let result = [...services];

    if (searchTerm) {
      result = result.filter((service) =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.provider?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((service) => service.category?.id === Number(selectedCategory));
    }

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'title_asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return result;
  }, [searchTerm, selectedCategory, sortBy, services]);

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

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Loading services...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      ) : filteredAndSortedServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No services match your criteria.</p>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
