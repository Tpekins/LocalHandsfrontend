import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import { useAuth } from '../../contexts/AuthContext';
import { ServiceOrder, Proposal, ProposalStatus } from '../../types';
import { formatCurrency } from '../../utils/currency';

const SubmitProposalPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [job] = useState<ServiceOrder | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedPrice, setProposedPrice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('Job not found.');
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter) {
      setError('Please write a cover letter.');
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newProposal: Proposal = {
      id: Date.now(),
      provider: currentUser!,
      providerId: currentUser!.id,
      service: job!.service,
      serviceId: job!.serviceId,
      coverLetter,
      bidAmount: proposedPrice ? parseFloat(proposedPrice) : 0,
      status: ProposalStatus.PENDING,
      createdAt: new Date().toISOString(),
    };

    console.log('New Proposal Submitted:', newProposal);
    setIsLoading(false);
    
    navigate('/provider/browse-jobs', { state: { proposalSubmitted: true } });
  };

  if (error && !job) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <Link to="/provider/browse-jobs">
            <Button variant="primary">Back to Jobs</Button>
        </Link>
      </Card>
    );
  }

  if (!job) {
    return <p className="text-center py-10">Loading job details...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6 md:p-8 shadow-xl">
        <div className="mb-6 pb-4 border-b">
            <h1 className="text-2xl font-poppins font-bold text-gray-800 mb-2">Apply for: {job.service.title}</h1>
            <p className="text-sm text-gray-600">Client: {job.client.name}</p>
            <p className="text-sm text-gray-500 line-clamp-3 mt-1">{job.description}</p>
            {job.budget && <p className="text-sm text-primary font-medium mt-1">Client's Budget: {formatCurrency(job.budget)}</p>}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && !coverLetter && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
              Your Cover Letter
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Introduce yourself, highlight your relevant skills, and explain why you're a great fit for this job."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
                label="Your Proposed Price (FCFA) (Optional)"
                name="proposedPrice"
                type="number"
                placeholder={job.budget ? `e.g., ${job.budget}` : "e.g., 150000"}
                value={proposedPrice}
                onChange={(e) => setProposedPrice(e.target.value)}
                min="0"
                step="any"
            />
          </div>
          
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Link to="/provider/browse-jobs">
                <Button type="button" variant="outline" disabled={isLoading}>
                    Cancel
                </Button>
            </Link>
            <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading || !coverLetter}>
              {isLoading ? 'Submitting...' : 'Submit Proposal'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SubmitProposalPage;