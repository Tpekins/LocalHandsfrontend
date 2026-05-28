
import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import { Payment } from '../../types';
import api from '../../utils/api';

/*
 * TransactionsPage — GET /api/payments
 *
 * Lists all payment transactions from the Payment table.
 * Each payment includes contract info (service order, client, provider)
 * via the backend's include chain on findAll().
 */

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Modal state */
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<Payment | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  /* GET /api/payments */
  useEffect(() => {
    api.get<Payment[]>('/payments')
      .then(({ data }) => setTransactions(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load transactions.'))
      .finally(() => setLoading(false));
  }, []);

  /* Close dropdown on click outside */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.dropdown-actions')) setDropdownOpen(null);
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  const handleView = (txn: Payment) => { setSelectedTxn(txn); setViewModalOpen(true); };

  const formatAmount = (amount: number) =>
    amount?.toLocaleString('fr-FR', { style: 'currency', currency: 'XAF' });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-poppins font-bold text-gray-800">Transactions</h1>
      <p className="text-gray-600 mb-4">All financial transactions across the platform.</p>

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading transactions...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Transaction ID</th>
                <th className="py-3 px-4 text-left">Method</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400">No transactions found.</td></tr>
              ) : (
                transactions.map((txn) => (
                  <tr key={txn.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 font-mono">{txn.id}</td>
                    <td className="py-2 px-4">{new Date(txn.createdAt).toLocaleString()}</td>
                    <td className="py-2 px-4 font-mono text-xs">{txn.transactionId}</td>
                    <td className="py-2 px-4">{txn.paymentMethod}</td>
                    <td className="py-2 px-4">{formatAmount(txn.amount)}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold
                        ${txn.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : ''}
                        ${txn.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${txn.status === 'FAILED' ? 'bg-red-100 text-red-700' : ''}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-2 px-2 relative dropdown-actions">
                      <button
                        className="flex items-center gap-1 px-2 py-1 border rounded hover:bg-gray-100"
                        onClick={() => setDropdownOpen(dropdownOpen === String(txn.id) ? null : String(txn.id))}
                        aria-label="Actions"
                      >
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.08l3.71-3.85a.75.75 0 1 1 1.08 1.04l-4.25 4.4a.75.75 0 0 1-1.08 0l-4.25-4.4a.75.75 0 0 1 .02-1.06z"/></svg>
                      </button>
                      {dropdownOpen === String(txn.id) && (
                        <div className="absolute right-0 z-10 mt-2 w-28 bg-white border rounded shadow-lg">
                          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { handleView(txn); setDropdownOpen(null); }}>View</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {viewModalOpen && selectedTxn && (
        <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Transaction Details" size="md">
          <div className="space-y-2">
            <div><b>Transaction ID:</b> {selectedTxn.id}</div>
            <div><b>External ID:</b> {selectedTxn.transactionId}</div>
            <div><b>Date:</b> {new Date(selectedTxn.createdAt).toLocaleString()}</div>
            <div><b>Method:</b> {selectedTxn.paymentMethod}</div>
            <div><b>Amount:</b> {formatAmount(selectedTxn.amount)}</div>
            <div><b>Status:</b> {selectedTxn.status}</div>
            <div><b>Contract ID:</b> {selectedTxn.contractId}</div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TransactionsPage;
