import React, { useState } from 'react';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { addApplication } from '../../utils/applicationData';

const CareersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<{ title: string } | null>(null);
  
  const handleApplyClick = (job: { title: string }) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    if (selectedJob && name && email) {
      addApplication({ 
        jobTitle: selectedJob.title, 
        name,
        email 
      });
      alert(`Thank you for applying for the ${selectedJob.title} position!`);
      handleCloseModal();
    } else {
      alert('Please fill in all fields.');
    }
  };

  const jobOpenings = [
    {
      title: 'Lead Frontend Developer',
      location: 'Remote',
      description: 'We are looking for an experienced Frontend Developer to lead our web development team. You will be responsible for building beautiful, responsive, and highly performant user interfaces in React and TypeScript.'
    },
    {
      title: 'Community Manager',
      location: 'New York, NY',
      description: 'As a Community Manager, you will be the voice of Local Hands. You will engage with our users, manage our social media presence, and work to build a strong, supportive community for both customers and providers.'
    },
    {
      title: 'Senior Backend Engineer',
      location: 'Remote',
      description: 'Join our backend team to build and scale the infrastructure that powers Local Hands. You will work with Node.js, PostgreSQL, and AWS to create a reliable and secure platform.'
    }
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold font-poppins text-gray-800 mb-4">Join Our Team</h1>
          <p className="text-lg text-gray-600">We're on a mission to empower local communities. If you're passionate, innovative, and want to make a real impact, we'd love to hear from you.</p>
        </div>
        <div className="max-w-3xl mx-auto">
          {jobOpenings.map((job, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-semibold font-poppins text-gray-800">{job.title}</h2>
              <p className="text-gray-500 mb-4">{job.location}</p>
              <p className="text-gray-600 mb-4">{job.description}</p>
              <Button variant="primary" onClick={() => handleApplyClick(job)}>Apply Now</Button>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`Apply for: ${selectedJob?.title}`} size="lg">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <p className="text-gray-600">Please fill out the form below to submit your application.</p>
          <Input
            label="Full Name"
            name="name"
            type="text"
            required
            placeholder="John Doe"
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
          <div>
            <label htmlFor="resume" className="block text-sm font-medium text-gray-700">Resume/CV</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-accent focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOCX up to 10MB</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Application</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CareersPage;
