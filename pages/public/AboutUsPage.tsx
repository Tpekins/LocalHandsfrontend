import React from 'react';

const AboutUsPage: React.FC = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold font-poppins text-gray-800 mb-4">About Local Hands</h1>
          <p className="text-lg text-gray-600 mb-8">Empowering local communities by connecting skilled professionals with neighbors in need.</p>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold font-poppins text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Local Hands was founded on a simple idea: that finding trusted, local help shouldn't be a chore. We saw our friends and family struggle to find reliable plumbers, cleaners, and handymen, while skilled professionals in our community were looking for more ways to connect with clients. We knew there had to be a better way.
            </p>
            <p className="text-gray-600">
              We built this platform to bridge that gap. Local Hands is more than just a marketplace; it's a community hub designed to foster connections, build trust, and support the local economy. Every transaction on our platform helps a local professional grow their business and a neighbor get a job done right.
            </p>
          </div>
          <div>
            <img src="/placeholder-team.jpg" alt="Our Team" className="rounded-lg shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
