
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { DUMMY_SERVICE_ORDERS, DUMMY_PROPOSALS } from '../../utils/dummyData';
import { ServiceOrder, Proposal, ServiceOrderStatus } from '../../types';
import { InboxIcon, ChatBubbleLeftRightIcon, CheckCircleIcon, EyeIcon } from '../../components/icons/Icons';

const MyProposalsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const clientJobs = useMemo(() => 
    DUMMY_SERVICE_ORDERS.filter(order => order.clientId === currentUser?.id),
    [currentUser?.id]
  );

  const proposalsForClientJobs = useMemo(() =>
    DUMMY_PROPOSALS.filter(proposal => 
      clientJobs.some(job => job.id === proposal.serviceOrderId)
    ),
    [clientJobs]
  );
  
  // Group proposals by job
  const proposalsByJob = useMemo(() => {
    return clientJobs.reduce((acc, job) => {
      const jobProposals = proposalsForClientJobs.filter(p => p.serviceOrderId === job.id);
      if (jobProposals.length > 0) {
        acc[job.id] = { job, proposals: jobProposals };
      }
      return acc;
    }, {} as Record<string, { job: ServiceOrder, proposals: Proposal[] }>);
  }, [clientJobs, proposalsForClientJobs]);


  const handleAcceptProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setIsModalOpen(true);
  };

  const confirmAcceptProposal = () => {
    if (selectedProposal) {
      // Simulate API call to accept proposal
      console.log('Accepted proposal:', selectedProposal);
      // Update proposal status (in dummy data for now)
      const proposalIndex = DUMMY_PROPOSALS.findIndex(p => p.id === selectedProposal.id);
      if (proposalIndex > -1) DUMMY_PROPOSALS[proposalIndex].status = 'Accepted';
      
      // Update job status
      const jobIndex = DUMMY_SERVICE_ORDERS.findIndex(j => j.id === selectedProposal.serviceOrderId);
      if (jobIndex > -1) DUMMY_SERVICE_ORDERS[jobIndex].status = ServiceOrderStatus.IN_PROGRESS;

      alert(`Proposal from ${selectedProposal.providerName} accepted! The job is now In Progress.`);
      setIsModalOpen(false);
      setSelectedProposal(null);
      // Force re-render if necessary, or use state management
    }
  };

  if (!currentUser) return <p>Loading...</p>;
  
  const jobEntries = Object.values(proposalsByJob);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-poppins font-bold text-gray-800">Proposals for Your Jobs</h1>
      </div>

      {jobEntries.length === 0 && (
        <Card className="p-8 text-center">
          <InboxIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Proposals Yet</h2>
          <p className="text-gray-500 mb-4">You haven't received any proposals for your active jobs, or your jobs have no proposals.</p>
          <Link to="/client/post-job">
            <Button variant="primary">Post a New Job</Button>
          </Link>
        </Card>
      )}

      {jobEntries.map(({ job, proposals }) => (
        <Card key={job.id} className="p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-poppins font-semibold text-primary mb-1">{job.title}</h2>
          <p className="text-sm text-gray-500 mb-4">Posted: {new Date(job.postedDate).toLocaleDateString()} - Status: <span className={`font-medium ${job.status === ServiceOrderStatus.OPEN ? 'text-green-600' : 'text-yellow-600'}`}>{job.status}</span></p>
          
          {proposals.length === 0 ? (
            <p className="text-gray-600">No proposals received for this job yet.</p>
          ) : (
            <div className="space-y-4">
              {proposals.map(proposal => (
                <Card key={proposal.id} className="p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <div className="flex items-center mb-2 sm:mb-0">
                        <img src={proposal.providerAvatar || `https://picsum.photos/seed/${proposal.providerId}/40/40`} alt={proposal.providerName} className="w-10 h-10 rounded-full mr-3"/>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">{proposal.providerName}</h3>
                            <p className="text-xs text-gray-500">Submitted: {new Date(proposal.submittedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 sm:hidden">{proposal.coverLetter.substring(0,100)}...</p>
                    </div>
                    <div className="text-right mt-3 sm:mt-0">
                      {proposal.proposedPrice && <p className="text-xl font-semibold text-primary">${proposal.proposedPrice.toFixed(2)}</p>}
                      <p className="text-sm text-gray-500">{proposal.estimatedDuration}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 my-3 hidden sm:block">{proposal.coverLetter}</p>
                  <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-200">
                    <Button variant="outline" size="sm" leftIcon={<EyeIcon className="w-4 h-4"/>}>View Details</Button>
                    <Button variant="ghost" size="sm" leftIcon={<ChatBubbleLeftRightIcon className="w-4 h-4"/>}>Chat</Button>
                    {proposal.status === 'Pending' && job.status === ServiceOrderStatus.OPEN && (
                      <Button 
                        variant="primary" 
                        size="sm" 
                        leftIcon={<CheckCircleIcon className="w-4 h-4"/>}
                        onClick={() => handleAcceptProposal(proposal)}
                      >
                        Accept Proposal
                      </Button>
                    )}
                     {proposal.status === 'Accepted' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                           <CheckCircleIcon className="w-4 h-4 mr-1.5"/> Accepted
                        </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      ))}

      {selectedProposal && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Confirm Acceptance"
        >
          <p className="text-gray-700 mb-4">
            Are you sure you want to accept the proposal from <span className="font-semibold">{selectedProposal.providerName}</span> for the job "{proposalsByJob[selectedProposal.serviceOrderId]?.job.title}"?
          </p>
          {selectedProposal.proposedPrice && <p className="text-lg font-semibold text-primary mb-4">Proposed Price: ${selectedProposal.proposedPrice.toFixed(2)}</p>}
          <p className="text-sm text-gray-600 mb-6">
            Accepting this proposal will mark the job as "In Progress". You can then coordinate with the provider.
            (Payment processing would typically be handled here or in the next step in a real app).
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={confirmAcceptProposal}>Confirm & Accept</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyProposalsPage;
