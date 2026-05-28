import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { Proposal, ProposalStatus } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { DocumentTextIcon } from '../../components/icons/Icons';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

// GET /api/proposal?providerId={currentUser.id}
const ProposalsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [sentProposals, setSentProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    api.get<Proposal[]>('/proposal', { params: { providerId: currentUser.id } })
      .then(({ data }) => setSentProposals(data))
      .catch(() => { /* empty state */ })
      .finally(() => setIsLoading(false));
  }, [currentUser]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-poppins font-bold text-gray-800">Proposals You've Sent</h1>

      {isLoading ? (
        <p className="text-gray-500">Loading your proposals...</p>
      ) : sentProposals.length === 0 ? (
        <Card className="p-8 text-center">
          <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Proposals Sent Yet</h2>
          <p className="text-gray-500 mb-4">You haven't submitted any proposals for jobs. Start by browsing open jobs.</p>
          <Link to="/provider/browse-jobs">
            <Button variant="primary">Browse Jobs</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {sentProposals.map((proposal) => (
            <Card key={proposal.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <h2 className="text-xl font-poppins font-semibold text-primary mb-1">
                    Proposal for: {proposal.service?.title || 'Unknown service'}
                  </h2>
                  <p className="text-sm text-gray-500">Submitted: {new Date(proposal.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Proposed Price: {formatCurrency(proposal.bidAmount)}</p>
                </div>
                <div className="mt-4 sm:mt-0 text-left sm:text-right">
                  <span className={`px-3 py-1 inline-block rounded-full text-sm font-semibold
                    ${proposal.status === ProposalStatus.PENDING ? 'bg-yellow-100 text-yellow-700' : ''}
                    ${proposal.status === ProposalStatus.ACCEPTED ? 'bg-green-100 text-green-700' : ''}
                    ${proposal.status === ProposalStatus.REJECTED ? 'bg-red-100 text-red-700' : ''}
                  `}>
                    {proposal.status}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mt-3 pt-3 border-t border-gray-200 line-clamp-3 leading-relaxed">
                {proposal.coverLetter}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposalsPage;
