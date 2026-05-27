import React from 'react';
import { submittedApplications } from '../../utils/applicationData';
import Card from '../../components/Card';

const ApplicationsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-poppins font-semibold mb-6">Job Applications</h1>
      <Card className="p-0">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {submittedApplications.length > 0 ? (
                        submittedApplications.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.jobTitle}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.submittedAt.toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                                No applications submitted yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};

export default ApplicationsPage;
