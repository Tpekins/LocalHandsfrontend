import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] text-center px-4">
      <img 
        src="https://picsum.photos/seed/404/400/300" 
        alt="Not Found Illustration" 
        className="w-full max-w-sm h-auto mb-8 rounded-lg shadow-lg"
      />
      <h1 className="text-6xl font-poppins font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-poppins font-semibold text-gray-700 mb-6">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Oops! The page you're looking for doesn't seem to exist. It might have been moved, deleted, or you might have mistyped the URL.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg">
          Go Back Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
