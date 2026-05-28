import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import { ChartBarIcon, CurrencyDollarIcon } from '../../components/icons/Icons';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import { Payment } from '../../types';
import { formatCurrency } from '../../utils/currency';
import api from '../../utils/api';
import { toast } from 'sonner';

// GET /api/payments — fetches payment history for the provider
const EarningsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');

  useEffect(() => {
    api.get<Payment[]>('/payments')
      .then(({ data }) => setPayments(data))
      .catch(() => { /* empty state */ })
      .finally(() => setIsLoading(false));
  }, []);

  // Build chart data from actual payment records (by month)
  const monthlyData = payments.reduce((acc: Record<string, number>, p) => {
    const month = new Date(p.createdAt).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + p.amount;
    return acc;
  }, {});
  const chartData = Object.entries(monthlyData).map(([name, earnings]) => ({ name, earnings }));

  const completedPayments = payments.filter((p) => p.status === 'COMPLETED');
  const totalEarnings = completedPayments.reduce((sum, p) => sum + p.amount, 0);

  const handleRequestWithdrawal = () => {
    if (parseFloat(withdrawalAmount) > totalEarnings) {
      toast.error('Withdrawal amount cannot exceed available balance.');
      return;
    }
    if (parseFloat(withdrawalAmount) <= 0 || !withdrawalAmount) {
      toast.error('Please enter a valid withdrawal amount.');
      return;
    }
    toast.success(`Withdrawal of ${formatCurrency(parseFloat(withdrawalAmount))} requested!`);
    setIsWithdrawalModalOpen(false);
    setWithdrawalAmount('');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-poppins font-bold text-gray-800">Earnings</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Total Earned</h2>
            <CurrencyDollarIcon className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-4xl font-bold">{formatCurrency(totalEarnings)}</p>
          <p className="text-sm opacity-90">{completedPayments.length} completed payments</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-yellow-400 to-amber-500 text-gray-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Pending Payments</h2>
            <ChartBarIcon className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-4xl font-bold">{payments.filter((p) => p.status === 'PENDING').length}</p>
          <p className="text-sm opacity-90">Awaiting confirmation</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Available for Withdrawal</h2>
            <CurrencyDollarIcon className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-4xl font-bold">{formatCurrency(totalEarnings)}</p>
          <button
            className="mt-3 bg-white/30 hover:bg-white/40 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm"
            onClick={() => setIsWithdrawalModalOpen(true)}
          >
            Request Withdrawal
          </button>
        </Card>
      </div>

      {/* Chart from payment data */}
      <Card className="p-6 shadow-lg">
        <h2 className="text-2xl font-poppins font-semibold text-gray-700 mb-4">Monthly Earnings</h2>
        {chartData.length > 0 ? (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Line type="monotone" dataKey="earnings" stroke="#0d9488" strokeWidth={2} name="Earnings" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">No earnings data yet.</p>
        )}
      </Card>

      {/* Transaction history table from payments */}
      <Card className="p-6 shadow-xl">
        <h2 className="text-2xl font-poppins font-semibold text-gray-700 mb-4">Transaction History</h2>
        {isLoading ? (
          <p className="text-gray-500">Loading transactions...</p>
        ) : payments.length === 0 ? (
          <p className="text-gray-500">No transactions yet. Completed jobs will appear here.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-lightGray">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {p.transactionId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                      +{formatCurrency(p.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${p.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                        ${p.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${p.status === 'FAILED' ? 'bg-red-100 text-red-800' : ''}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="p-6 shadow-lg">
        <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-3">Withdrawal Settings</h2>
        <p className="text-gray-600 mb-4">Manage your bank accounts and other payment methods.</p>
        <div className="flex space-x-4">
          <Link to="/provider/payment-methods"><Button variant="outline">Manage Payment Methods</Button></Link>
          <Button onClick={() => setIsWithdrawalModalOpen(true)}>Request Withdrawal</Button>
        </div>
      </Card>

      <Modal isOpen={isWithdrawalModalOpen} onClose={() => setIsWithdrawalModalOpen(false)} title="Request a Withdrawal">
        <form onSubmit={(e) => { e.preventDefault(); handleRequestWithdrawal(); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Available for Withdrawal</label>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalEarnings)}</p>
            </div>
            <div>
              <label htmlFor="withdrawalAmount" className="block text-sm font-medium text-gray-700">Amount</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">FCFA</span>
                </div>
                <input
                  type="number"
                  id="withdrawalAmount"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="focus:ring-primary focus:border-primary block w-full pl-14 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsWithdrawalModalOpen(false)}>Cancel</Button>
              <Button type="submit">Submit Request</Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EarningsPage;
