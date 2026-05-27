import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { DUMMY_SERVICE_ORDERS, DUMMY_CATEGORIES } from '../../utils/dummyData';
import { ServiceOrder, ServiceOrderStatus } from '../../types';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { BriefcaseIcon, SearchIcon } from '../../components/icons/Icons';

const BrowseJobsPage: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSuccessMessage, setShowSuccessMessage] = useState(location.state?.proposalSubmitted || false);

  React.useEffect(() => {
    if (location.state?.proposalSubmitted) {
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000); // Hide after 5s
      // Clear location state to prevent message on subsequent visits without new submission
      window.history.replaceState({}, document.title)
      return () => clearTimeout(timer);
    }
  }, [location.state]);


  const categoryOptions = [{ value: 'all', label: 'All Categories' }, ...DUMMY_CATEGORIES.map(cat => ({ value: cat.id, label: cat.name }))];

  const openJobs = useMemo(() => {
    let jobs = DUMMY_SERVICE_ORDERS.filter(order => order.status === ServiceOrderStatus.OPEN);

    if (searchTerm) {
      jobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      jobs = jobs.filter(job => job.category.id === selectedCategory);
    }
    return jobs.sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()); // Newest first
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-poppins font-bold text-gray-800">Browse Job Opportunities</h1>

      {showSuccessMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow-md" role="alert">
          <p className="font-bold">Success!</p>
          <p>Your proposal has been submitted successfully.</p>
        </div>
      )}

      <Card className="p-4 sm:p-6 shadow-md sticky top-4 bg-white z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="relative">
            <Input
              label="Search Jobs"
              placeholder="e.g., Logo Design, Tutoring"
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
        </div>
      </Card>

      {openJobs.length === 0 ? (
        <Card className="p-8 text-center">
          <BriefcaseIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Open Jobs Found</h2>
          <p className="text-gray-500">There are no open jobs matching your criteria at the moment. Please check back later!</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {openJobs.map((job: ServiceOrder) => (
            <Card key={job.id} className="p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <h2 className="text-xl font-poppins font-semibold text-primary mb-1 group">
                    <Link to={`${job.id}/apply`} className="hover:underline group-hover:text-accent">
                      {job.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-600">Client: {job.clientName}</p>
                  <p className="text-sm text-gray-500">Category: {job.category.name}</p>
                  <p className="text-xs text-gray-400">Posted: {new Date(job.postedDate).toLocaleDateString()}</p>
                </div>
                <div className="mt-4 sm:mt-0 text-left sm:text-right">
                  {job.budget && <p className="text-lg font-semibold text-gray-800">{job.budget.toLocaleString()} FCFA</p>}
                   <p className="text-sm text-gray-500 mb-2">{job.deadline ? `Deadline: ${new Date(job.deadline).toLocaleDateString()}` : 'No deadline'}</p>
                  <Link to={`/provider/submit-proposal/${job.id}`}>

                    <Button variant="primary" size="md">View & Apply</Button>
                  </Link>
                </div>
              </div>
              <p className="text-gray-700 mt-3 pt-3 border-t border-gray-200 line-clamp-3 leading-relaxed">
                {job.description}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseJobsPage;
