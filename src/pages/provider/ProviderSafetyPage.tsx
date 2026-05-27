import React from 'react';

const ProviderSafetyPage: React.FC = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold font-poppins text-center mb-8">Your Safety is Our Priority</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold font-poppins mb-4">Safety Guidelines for Providers</h2>
            <p className="text-gray-600 mb-4">We are committed to creating a safe and respectful environment for all our providers. Here are some guidelines and tools to help you work safely and confidently:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li><strong>Communicate within the platform:</strong> Keep all communication and payments on the Local Hands platform to protect your personal information and ensure you're covered by our policies.</li>
              <li><strong>Set clear expectations:</strong> Before starting a job, confirm the scope of work, timeline, and payment details with the client through our messaging system.</li>
              <li><strong>Report any issues:</strong> If you ever feel unsafe or encounter a problem with a client, please report it to our support team immediately. We are here to help.</li>
              <li><strong>Trust your instincts:</strong> If a situation feels uncomfortable, you have the right to decline or stop a job. Your safety comes first.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderSafetyPage;
