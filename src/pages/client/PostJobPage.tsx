import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Card from '../../components/Card';
import { DUMMY_CATEGORIES, DUMMY_SERVICE_ORDERS } from '../../utils/dummyData';
import { useAuth } from '../../contexts/AuthContext';
import { Category, ServiceOrder, ServiceOrderStatus } from '../../types';


const PostJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>(DUMMY_CATEGORIES[0]?.id || '');
  const [budget, setBudget] = useState<string>('');
  const [deadline, setDeadline] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const categoryOptions = DUMMY_CATEGORIES.map(cat => ({ value: cat.id, label: cat.name }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !categoryId) {
      setError('Please fill in all required fields: Title, Description, and Category.');
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newJob: ServiceOrder = {
      id: `order-${Date.now()}`,
      clientId: currentUser?.id || 'unknown-client',
      clientName: currentUser?.name || 'Unknown Client',
      title,
      description,
      category: DUMMY_CATEGORIES.find(c => c.id === categoryId) as Category,
      budget: budget ? parseFloat(budget) : undefined,
      deadline,
      postedDate: new Date().toISOString(),
      status: ServiceOrderStatus.OPEN,
      proposalsCount: 0,
    };

    // In a real app, you'd send this to the backend.
    // We can add it to a local state or just simulate success.
    console.log('New Job Posted:', newJob);
    DUMMY_SERVICE_ORDERS.unshift(newJob); // Add to global dummy data for visibility

    setIsLoading(false);
    alert('Job posted successfully!');
    navigate('/client/dashboard'); // Or to a "My Jobs" page
  };
  
  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-poppins font-bold text-gray-800 mb-8">Post a New Job</h1>
      <Card className="p-6 md:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          
          {/* Step Indicator (Optional) */}
          <div className="mb-6">
            <p className="text-sm text-gray-500">Step {currentStep} of 2</p>
            <div className="w-full bg-mediumGray rounded-full h-2">
                <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(currentStep/2)*100}%`}}
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
                label="Category"
                name="category"
                options={categoryOptions}
                value={categoryId}
                onChange={(e) => setCategoryId(String(e.target.value))}
              />
            </section>
          )}

          {currentStep === 2 && (
            <section>
              <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-4">Budget & Deadline (Optional)</h2>
              <Input
                label="Budget (FCFA) (Optional)"
                name="budget"
                type="number"
                placeholder="e.g., 50000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
              <Input
                label="Deadline"
                name="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </section>
          )}
          
          <div className="flex justify-between items-center pt-4">
            {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep} disabled={isLoading}>
                    Previous
                </Button>
            )}
            {currentStep < 2 && (
                 <Button type="button" variant="primary" onClick={nextStep} className="ml-auto" disabled={isLoading || !title || !description || !categoryId}>
                    Next
                </Button>
            )}
            {currentStep === 2 && (
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
