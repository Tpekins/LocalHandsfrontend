import React from 'react';

const WhyProvidePage: React.FC = () => {
  return (
    <div className="bg-primary text-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold font-poppins mb-4">Why Join Local Hands?</h1>
        <p className="text-lg mb-12">Take control of your work, connect with new clients, and grow your business on your own terms.</p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold font-poppins mb-4">Flexible Schedule</h2>
            <p>You decide when and where you want to work. Set your own hours and accept only the jobs that fit your schedule.</p>
          </div>
          <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold font-poppins mb-4">Get New Clients</h2>
            <p>We connect you with a steady stream of potential clients in your area, so you can spend less time searching for work and more time doing what you love.</p>
          </div>
          <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold font-poppins mb-4">Secure Payments</h2>
            <p>Get paid quickly and securely through our platform. We handle the billing, so you don't have to worry about chasing payments.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyProvidePage;
