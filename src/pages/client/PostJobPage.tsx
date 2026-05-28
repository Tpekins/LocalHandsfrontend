import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Card from '../../components/Card';
import { useAuth } from '../../contexts/AuthContext';
import { Service, Category } from '../../types';
import api from '../../utils/api';
import { toast } from 'sonner';

/*
 * PostJobPage – POST /api/serviceorder + GET /api/services + GET /api/category
 *
 * Data flow:
 *   On mount → api.get("/services?status=available") populates service dropdown
 *   On mount → api.get("/category") populates category filter dropdown
 *   On submit → api.post("/serviceorder", { serviceId, clientId, description, budget })
 *     → Backend validates service & client exist, inserts into ServiceOrder table
 *     → Redirects to /client/dashboard on success
 *
 * Note: The backend requires a serviceId (tying the order to an existing service).
 * If no service is selected, a generic serviceId of 0 is passed (the backend
 * will reject it with a 404 — consider creating a "general request" service).
 */
const PostJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [serviceId, setServiceId] = useState<string>('');

  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState('');

  // → Fetch services + categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          api.get<Service[]>('/services', { params: { status: 'available' } }),
          api.get<Category[]>('/category'),
        ]);
        setServices(servicesRes.data);
        setCategories(categoriesRes.data);
      } catch {
        toast.error('Failed to load services. Please try again.');
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter services by selected category
  const filteredServices = categoryId
    ? services.filter((s) => s.categoryId === Number(categoryId))
    : services;

  const serviceOptions = [
    { value: '', label: 'Select a service...' },
    ...filteredServices.map((s) => ({
      value: String(s.id),
      label: `${s.title} — ${s.provider?.name || 'Unknown provider'}`,
    })),
  ];

  const categoryOptions: { value: string; label: string }[] = [
    { value: '', label: 'All Categories' },
    ...categories.map((c) => ({ value: String(c.id), label: c.name })),
  ];

  // → POST /api/serviceorder
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setError('You must be logged in to post a job.');
      return;
    }
    if (!title || !description) {
      setError('Please fill in the job title and description.');
      return;
    }
    if (!serviceId) {
      setError('Please select a service.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const fullDescription = `[${title}] ${description}`;
      await api.post('/serviceorder', {
        serviceId: Number(serviceId),
        clientId: currentUser.id,
        description: fullDescription,
        budget: budget ? parseFloat(budget) : undefined,
      });

      toast.success('Job posted successfully!');
      navigate('/client/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to post job.';
      setError(Array.isArray(msg) ? msg.join(' ') : msg);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  if (isPageLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-poppins font-bold text-gray-800 mb-8">Post a New Job</h1>
        <p className="text-gray-500">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-poppins font-bold text-gray-800 mb-8">Post a New Job</h1>
      <Card className="p-6 md:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

          {/* Step Indicator */}
          <div className="mb-6">
            <p className="text-sm text-gray-500">Step {currentStep} of 3</p>
            <div className="w-full bg-mediumGray rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {currentStep === 1 && (
            <section>
              <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-4">Job Details</h2>
              <Input
                label="Job Title"
                name="title"
                placeholder="e.g., Need a logo for my new startup"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Describe the work you need done, including specific requirements, skills needed, and any relevant details."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <Select
                label="Category (filter services)"
                name="category"
                options={categoryOptions}
                value={categoryId}
                onChange={(e) => setCategoryId(String(e.target.value))}
              />
            </section>
          )}

          {currentStep === 2 && (
            <section>
              <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-4">Select a Service</h2>
              <Select
                label="Choose a Service"
                name="service"
                options={serviceOptions}
                value={serviceId}
                onChange={(e) => setServiceId(String(e.target.value))}
              />
              <p className="text-sm text-gray-500 mt-2">
                Select the service you want to request. Use the category filter in Step 1 to narrow down options.
              </p>
            </section>
          )}

          {currentStep === 3 && (
            <section>
              <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-4">Budget (Optional)</h2>
              <Input
                label="Budget (FCFA)"
                name="budget"
                type="number"
                placeholder="e.g., 50000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </section>
          )}

          <div className="flex justify-between items-center pt-4">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep} disabled={isLoading}>
                Previous
              </Button>
            )}
            {currentStep < 3 && (
              <Button
                type="button"
                variant="primary"
                onClick={nextStep}
                className="ml-auto"
                disabled={isLoading || !title || !description}
              >
                Next
              </Button>
            )}
            {currentStep === 3 && (
              <Button type="submit" variant="primary" className="ml-auto" isLoading={isLoading} disabled={isLoading}>
                {isLoading ? 'Posting Job...' : 'Post Job'}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PostJobPage;
