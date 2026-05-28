
import React from 'react';
import Card from '../../components/Card';
import { DocumentTextIcon, ChartBarIcon, UsersIcon, CurrencyDollarIcon } from '../../components/icons/Icons';
import Button from '../../components/Button';
import Modal from '../../components/Modal';

const ReportsPage: React.FC = () => {

  const reportTypes = [
    { id: 'user_activity', name: 'User Activity Report', description: 'Tracks user registrations, logins, and engagement.', icon: UsersIcon },
    { id: 'financial_summary', name: 'Financial Summary Report', description: 'Overview of platform revenue, commissions, and payouts.', icon: CurrencyDollarIcon },
    { id: 'service_trends', name: 'Service Trends Report', description: 'Analysis of popular services, categories, and provider performance.', icon: ChartBarIcon },
    { id: 'dispute_resolution', name: 'Dispute Resolution Report', description: 'Summary of disputes raised, resolution times, and outcomes.', icon: DocumentTextIcon },
  ];

  const [showTxnReportModal, setShowTxnReportModal] = React.useState(false);
  const [reportType, setReportType] = React.useState<string | null>(null);

  const handleGenerateReport = (reportId: string) => {
    if (reportId === 'financial_summary') {
      setShowTxnReportModal(true);
      setReportType(reportId);
    } else {
      alert(`Generating report: ${reportId} (mock action). This would typically involve data fetching and processing.`);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-poppins font-bold text-gray-800">System Reports</h1>
      <p className="text-gray-600">
        Generate various reports to gain insights into platform activity, financials, and user behavior.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map(report => (
            <Card key={report.id} className="p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-3">
                    {report.icon && <report.icon className="w-10 h-10 text-primary mr-4"/>}
                    <h2 className="text-xl font-poppins font-semibold text-gray-700">{report.name}</h2>
                </div>
                <p className="text-gray-600 text-sm mb-4 min-h-[3em]">{report.description}</p>
                <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">Last generated: Never</div> {/* Placeholder */}
                    <Button variant="primary" size="sm" onClick={() => handleGenerateReport(report.id)}>
                        Generate Report
                    </Button>
                </div>
                {/* Add date range selectors or other filters if needed */}
            </Card>
        ))}
      </div>

      <Card className="p-6 shadow-lg">
        <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-3">Custom Report Builder (Future)</h2>
        <p className="text-gray-600">
            This section will allow for generating custom reports by selecting specific data points, filters, and date ranges.
        </p>
      </Card>
      {/* Modal for Financial Summary Report - Transaction Table */}
      {showTxnReportModal && reportType === 'financial_summary' && (
        <Modal isOpen={showTxnReportModal} onClose={() => setShowTxnReportModal(false)} title="Financial Summary - Transactions" size="xl" className="max-w-6xl w-full">
          {/* Inline transaction table (mock data) */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow-md mb-4">
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
                </tr>
              </thead>
              <tbody>
                {[].map((txn: any) => {
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-between items-center gap-4">
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  // Print handler: open a new window with report content and trigger print
                  const printWindow = window.open('', '_blank', 'width=900,height=700');
                  if (printWindow) {
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>Financial Summary Report</title>
                          <link href='https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css' rel='stylesheet'>
                        </head>
                        <body class='bg-white p-8'>
                          <h1 class='text-2xl font-bold mb-6'>Financial Summary - Transactions</h1>
                          <table class='min-w-full bg-white rounded shadow-md mb-4'>
                            <thead>
                              <tr class='bg-gray-100 text-gray-700'>
                                <th class='py-3 px-4 text-left'>Transaction ID</th>
                                <th class='py-3 px-4 text-left'>Date & Time</th>
                                <th class='py-3 px-4 text-left'>Client Name</th>
                                <th class='py-3 px-4 text-left'>Provider Name</th>
                                <th class='py-3 px-4 text-left'>Service/Contract</th>
                                <th class='py-3 px-4 text-left'>Payment Method</th>
                                <th class='py-3 px-4 text-left'>Amount</th>
                                <th class='py-3 px-4 text-left'>Payment Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              ''
                            </tbody>
                          </table>
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                    printWindow.focus();
                    setTimeout(() => printWindow.print(), 400);
                  }
                }}
              >
                Print Report
              </button>
              <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setShowTxnReportModal(false)}>Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ReportsPage;
