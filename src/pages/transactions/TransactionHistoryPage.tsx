import React from 'react';
import { CurrencyDollarIcon } from '../../components/icons/Icons';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed';
}

const mockTransactions: Transaction[] = [
  {
    id: 't1',
    date: '2025-06-25 23:30',
    description: "Escrow Deposit for 'Fix Leaky Faucet'",
    amount: -120,
    status: 'Completed',
  },
  {
    id: 't2',
    date: '2025-06-28 14:05',
    description: "Payout for Job #123",
    amount: 100,
    status: 'Pending',
  },
  {
    id: 't3',
    date: '2025-06-28 14:10',
    description: "Platform Fee",
    amount: -20,
    status: 'Completed',
  },
  {
    id: 't4',
    date: '2025-06-29 09:00',
    description: "Payment of $100.00 has been released to your account.",
    amount: 100,
    status: 'Completed',
  },
];

const statusColors = {
  Pending: 'text-yellow-600',
  Completed: 'text-green-600',
  Failed: 'text-red-600',
};

const TransactionHistoryPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-10 mb-10">
      <h1 className="text-2xl font-bold mb-6 text-primary flex items-center">
        <CurrencyDollarIcon className="w-7 h-7 mr-2 text-primary" /> Transaction History
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Date & Time</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700 uppercase">Amount</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {mockTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{tx.date}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{tx.description}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-mono ${tx.amount < 0 ? 'text-red-600' : 'text-green-700'}`}>
                  {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-center text-sm font-semibold ${statusColors[tx.status]}`}>{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Notification Example */}
      <div className="mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-center">
          <span className="text-blue-700 font-medium mr-2">Notification:</span>
          <span className="text-gray-700">Payment of $100.00 has been released to your account.</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
