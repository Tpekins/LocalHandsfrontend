
import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Always use mock (dominator) data regardless of backend status
    setLoading(true);
    setError(null);
    setTransactions([
      {
        id: 'txn_001',
        createdAt: new Date().toISOString(),
        amount: 10000,
        status: 'COMPLETED',
        paymentMethod: 'Mobile Money',
        contract: {
          contractId: 1,
          provider: { name: 'Jane Doe', email: 'jane@example.com', id: 'prov_1' },
          serviceOrder: {
            client: { name: 'John Smith', email: 'john@example.com', id: 'cli_1' },
            description: 'Plumbing repair',
            title: 'Plumbing Service'
          }
        }
      },
      {
        id: 'txn_002',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        amount: 25000,
        status: 'PENDING',
        paymentMethod: 'Mobile Money',
        contract: {
          contractId: 2,
          provider: { name: 'Alice Smith', email: 'alice@example.com', id: 'prov_2' },
          serviceOrder: {
            client: { name: 'Bob Johnson', email: 'bob@example.com', id: 'cli_2' },
            description: 'Electrical installation',
            title: 'Electrical Service'
          }
        }
      },
      {
        id: 'txn_003',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        amount: 5000,
        status: 'FAILED',
        paymentMethod: 'Mobile Money',
        contract: {
          contractId: 3,
          provider: { name: 'Grace Miller', email: 'grace@example.com', id: 'prov_3' },
          serviceOrder: {
            client: { name: 'Eve Jones', email: 'eve@example.com', id: 'cli_3' },
            description: 'Painting job',
            title: 'Painting Service'
          }
        }
      }
    ]);
    setLoading(false);
  }, []);

  // Modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<any>(null);
  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  // Close dropdown on click away
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-actions')) {
        setDropdownOpen(null);
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  const handleView = (txn: any) => {
    setSelectedTxn(txn);
    setViewModalOpen(true);
  };
  const handleDelete = (txn: any) => {
    setSelectedTxn(txn);
    setDeleteModalOpen(true);
  };
  const handleDeleteConfirm = () => {
    setTransactions((prev) => prev.filter((t) => t.id !== selectedTxn.id));
    setDeleteModalOpen(false);
    setSelectedTxn(null);
  };
  const handleModalClose = () => {
    setViewModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedTxn(null);
  };


  try {
    console.log('Transactions:', transactions, 'Loading:', loading, 'Error:', error);
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-poppins font-bold text-gray-800">Transactions</h1>
        <p className="text-gray-600 mb-4">
          This table shows all financial transactions on the platform. For detailed filtering, export, or audit, use the reporting tools.
        </p>
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading transactions...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow-md">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-3 px-4 text-left">Transaction ID</th>
                  <th className="py-3 px-4 text-left">Date & Time</th>
                  <th className="py-3 px-4 text-left">Client Name</th>
                  <th className="py-3 px-4 text-left">Provider Name</th>
                  <th className="py-3 px-4 text-left">Service/Contract</th>
                  <th className="py-3 px-4 text-left">Payment Method</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Payment Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-8 text-gray-400">No transactions found.</td></tr>
                ) : (
                  transactions.map((txn: any) => {
                    const client = txn.contract?.serviceOrder?.client;
                    const provider = txn.contract?.provider;
                    const contractTitle = txn.contract?.serviceOrder?.description || txn.contract?.serviceOrder?.title || `Contract #${txn.contractId}`;
                    return (
                      <tr key={txn.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-mono">{txn.id}</td>
                        <td className="py-2 px-4">{new Date(txn.createdAt).toLocaleString()}</td>
                        <td className="py-2 px-4">{client ? (client.name || client.email || client.id) : '-'}</td>
                        <td className="py-2 px-4">{provider ? (provider.name || provider.email || provider.id) : '-'}</td>
                        <td className="py-2 px-4">{contractTitle}</td>
                        <td className="py-2 px-4">{txn.paymentMethod}</td>
                        <td className="py-2 px-4">{txn.amount?.toLocaleString(undefined, { style: 'currency', currency: 'XAF' })}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${txn.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : txn.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-700'}`}>{txn.status}</span>
                        </td>
                        <td className="py-2 px-2 relative dropdown-actions">
                          <button
                            className="flex items-center gap-1 px-2 py-1 border rounded hover:bg-gray-100"
                            onClick={() => setDropdownOpen(dropdownOpen === txn.id ? null : txn.id)}
                            aria-label="Actions"
                          >
                            <span className="sr-only">Actions</span>
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.08l3.71-3.85a.75.75 0 1 1 1.08 1.04l-4.25 4.4a.75.75 0 0 1-1.08 0l-4.25-4.4a.75.75 0 0 1 .02-1.06z"/></svg>
                          </button>
                          {dropdownOpen === txn.id && (
                            <div className="absolute right-0 z-10 mt-2 w-28 bg-white border rounded shadow-lg">
                              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { handleView(txn); setDropdownOpen(null); }}>View</button>
                              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600" onClick={() => { handleDelete(txn); setDropdownOpen(null); }}>Delete</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      {/* View Transaction Modal */}
      {viewModalOpen && selectedTxn && (
        <Modal isOpen={viewModalOpen} onClose={handleModalClose} title="Transaction Details" size="md">
          <div className="space-y-2">
            <div><b>Transaction ID:</b> {selectedTxn.id}</div>
            <div><b>Date & Time:</b> {new Date(selectedTxn.createdAt).toLocaleString()}</div>
            <div><b>Payment Method:</b> {selectedTxn.paymentMethod}</div>
            <div><b>Amount:</b> {selectedTxn.amount?.toLocaleString(undefined, { style: 'currency', currency: 'XAF' })}</div>
            <div><b>Status:</b> <span className={`px-2 py-1 rounded text-xs font-semibold ${selectedTxn.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : selectedTxn.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-700'}`}>{selectedTxn.status}</span></div>
            <div><b>Client:</b> {selectedTxn.contract?.serviceOrder?.client?.name || '-'}</div>
            <div><b>Provider:</b> {selectedTxn.contract?.provider?.name || '-'}</div>
            <div><b>Service/Contract:</b> {selectedTxn.contract?.serviceOrder?.description || selectedTxn.contract?.serviceOrder?.title || `Contract #${selectedTxn.contract?.contractId}`}</div>
          </div>
        </Modal>
      )}
      {/* Delete Transaction Modal */}
      {deleteModalOpen && selectedTxn && (
        <Modal isOpen={deleteModalOpen} onClose={handleModalClose} title="Delete Transaction" size="sm">
          <div className="space-y-4">
            <div>Are you sure you want to delete transaction <span className="font-mono">{selectedTxn.id}</span>?</div>
            <div className="flex gap-4 justify-end">
              <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={handleModalClose}>Cancel</button>
              <button className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" onClick={handleDeleteConfirm}>Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
    );
  } catch (renderErr) {
    return <div style={{ color: 'red' }}>Render error: {String(renderErr)}</div>;
  }
};

export default TransactionsPage;
