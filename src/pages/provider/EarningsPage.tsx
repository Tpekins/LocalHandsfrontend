
import React, { useState } from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import { ChartBarIcon, CurrencyDollarIcon } from '../../components/icons/Icons'; 
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import { DUMMY_PROPOSALS, DUMMY_SERVICE_ORDERS } from '../../utils/dummyData';
import { ServiceOrderStatus, Proposal } from '../../types';
import { formatCurrency } from '../../utils/currency';

const EarningsPage: React.FC = () => {
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');

        const { currentUser } = useAuth();

    // Dummy data for the earnings chart
    const monthlyEarningsData = [
        { name: 'Jan', earnings: 4000 },
        { name: 'Feb', earnings: 3000 },
        { name: 'Mar', earnings: 5000 },
        { name: 'Apr', earnings: 4500 },
        { name: 'May', earnings: 6000 },
        { name: 'Jun', earnings: 5500 },
    ];

    const acceptedProposals = DUMMY_PROPOSALS.filter((p: Proposal) => {
        if (p.providerId !== currentUser?.id || p.status !== 'Accepted') return false;
        const job = DUMMY_SERVICE_ORDERS.find(o => o.id === p.serviceOrderId);
        return job?.status === ServiceOrderStatus.COMPLETED; // Simplified: assume completed jobs are paid
    });

    const totalEarnings = acceptedProposals.reduce((acc, proposal) => acc + (proposal.proposedPrice || 0), 0);

    const handleRequestWithdrawal = () => {
        if (parseFloat(withdrawalAmount) > totalEarnings) {
            alert("Withdrawal amount cannot exceed available balance.");
            return;
        }
        if (parseFloat(withdrawalAmount) <= 0 || !withdrawalAmount) {
            alert("Please enter a valid withdrawal amount.");
            return;
        }
        alert(`Withdrawal of ${formatCurrency(parseFloat(withdrawalAmount))} requested! (UI only)`);
        setIsWithdrawalModalOpen(false);
        setWithdrawalAmount('');
    };

    const pendingClearance = 0; // Placeholder for more complex logic
    const availableForWithdrawal = totalEarnings - pendingClearance; // Simplified

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-poppins font-bold text-gray-800">Earnings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Total Earned</h2>
                <CurrencyDollarIcon className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-4xl font-bold">{formatCurrency(totalEarnings)}</p>
            <p className="text-sm opacity-90">{`From ${acceptedProposals.length} completed jobs`}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-yellow-400 to-amber-500 text-gray-800 shadow-lg">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Pending Clearance</h2>
                <ChartBarIcon className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-4xl font-bold">{formatCurrency(pendingClearance)}</p>
             <p className="text-sm opacity-90">Funds being cleared</p>
        </Card>
         <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Available for Withdrawal</h2>
                <CurrencyDollarIcon className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-4xl font-bold">{formatCurrency(availableForWithdrawal)}</p>
            <button className="mt-3 bg-white/30 hover:bg-white/40 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm">
                Request Withdrawal
            </button>
        </Card>
            </div>

      {/* Monthly Earnings Chart */}
      <Card className="p-6 shadow-lg">
        <h2 className="text-2xl font-poppins font-semibold text-gray-700 mb-4">Monthly Earnings</h2>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={monthlyEarningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Line type="monotone" dataKey="earnings" stroke="#0d9488" strokeWidth={2} name="Earnings" />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6 shadow-xl">
        <h2 className="text-2xl font-poppins font-semibold text-gray-700 mb-4">Transaction History</h2>
        {acceptedProposals.length === 0 ? (
            <p className="text-gray-500">No transactions yet. Completed jobs will appear here.</p>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {acceptedProposals.map((p: Proposal) => {
                             const job = DUMMY_SERVICE_ORDERS.find(o => o.id === p.serviceOrderId);
                             return (
                                <tr key={p.id} className="hover:bg-lightGray">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(p.submittedDate).toLocaleDateString()}</td> {/* Use actual completion date if available */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job?.title || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">+{formatCurrency(p.proposedPrice || 0)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Cleared
                                        </span>
                                    </td>
                                </tr>
                             );
                        })}
                    </tbody>
                </table>
            </div>
        )}
      </Card>
      <Card className="p-6 shadow-lg">
        <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-3">Withdrawal Settings</h2>
        <p className="text-gray-600 mb-4">Manage your bank accounts and other payment methods.</p>
                <div className="flex space-x-4">
          <Link to="/provider/payment-methods">
            <Button variant="outline">Manage Payment Methods</Button>
          </Link>
          <Button onClick={() => setIsWithdrawalModalOpen(true)}>Request Withdrawal</Button>
        </div>
      </Card>

      <Modal isOpen={isWithdrawalModalOpen} onClose={() => setIsWithdrawalModalOpen(false)} title="Request a Withdrawal">
        <form onSubmit={(e) => { e.preventDefault(); handleRequestWithdrawal(); }}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Available for Withdrawal</label>
                    <p className="text-2xl font-bold text-gray-900">${totalEarnings.toFixed(2)}</p>
                </div>
                <div>
                    <label htmlFor="withdrawalAmount" className="block text-sm font-medium text-gray-700">Amount</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input 
                            type="number" 
                            name="withdrawalAmount" 
                            id="withdrawalAmount" 
                            value={withdrawalAmount}
                            onChange={(e) => setWithdrawalAmount(e.target.value)}
                            className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            placeholder="0.00"
                            aria-describedby="price-currency"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsWithdrawalModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        Submit Request
                    </Button>
                </div>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default EarningsPage;
