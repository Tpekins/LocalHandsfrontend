import React from 'react';
import { Link } from 'react-router-dom';

const HelpCenterPage: React.FC = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold font-poppins text-gray-800 mb-4">Help Center</h1>
        <p className="text-lg text-gray-600 mb-12">Find the resources you need to get the most out of Local Hands.</p>
        <div className="grid md:grid-cols-3 gap-8">
          <Link to="/faq" className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold font-poppins text-primary mb-2">FAQ</h2>
            <p className="text-gray-600">Find answers to frequently asked questions.</p>
          </Link>
          <Link to="/contact" className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold font-poppins text-primary mb-2">Contact Us</h2>
            <p className="text-gray-600">Get in touch with our support team for personalized assistance.</p>
          </Link>
          <Link to="/trust-and-safety" className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold font-poppins text-primary mb-2">Trust & Safety</h2>
            <p className="text-gray-600">Learn about our commitment to keeping our community safe.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
