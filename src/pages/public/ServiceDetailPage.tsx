import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Service, Review as ReviewType, UserRole, User } from '../../types';
import { formatCurrency } from '../../utils/currency';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import ReviewCard from '../../components/ReviewCard';
import ReviewForm from '../../components/ReviewForm';

const ServiceDetailPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const service = ([] as Service[]).find((s) => s.id === Number(serviceId));
  const provider = undefined as User | undefined;
  const reviews = [] as ReviewType[];

  const handleRequestService = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: window.location.pathname } });
    } else {
      setIsModalOpen(true);
    }
  };

  const handleMessageProvider = () => {
    if (!provider) return;
    if (!currentUser) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (currentUser.role === UserRole.CLIENT) {
      navigate(`/client/chat?recipientId=${provider.id}`);
    } else if (currentUser.role === UserRole.PROVIDER) {
      navigate(`/provider/chat?recipientId=${provider.id}`);
    } else {
      navigate(`/client/chat?recipientId=${provider.id}`);
    }
  };

  const handleReviewSubmitted = (review: ReviewType) => {
    console.log('Review submitted:', review);
  };

  if (!service || !provider) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl text-gray-700">Service not found.</h1>
        <Link to="/services">
          <Button variant="primary" className="mt-4">Back to Services</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="relative">
          <img 
            src={service.assets[0]?.imageUrl || 'https://source.unsplash.com/random/1200x500?sig=service-detail'} 
            alt={service.title} 
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <span className="bg-secondary text-gray-800 px-3 py-1 rounded-full text-sm font-semibold mb-2 inline-block">{service.category?.name}</span>
            <h1 className="text-3xl md:text-4xl font-poppins font-bold text-white mb-2">{service.title}</h1>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-poppins font-semibold text-gray-800 mb-4">Service Description</h2>
            <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">{service.description}</p>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-lightGray p-6 rounded-lg shadow">
              <h2 className="text-2xl font-poppins font-semibold text-primary mb-4">
                {formatCurrency(service.price)}
              </h2>
              <Button variant="primary" size="lg" className="w-full mb-3" onClick={handleRequestService}>
                Request This Service
              </Button>
              <Button variant="outline" size="lg" className="w-full" onClick={handleMessageProvider}>
                Message Provider
              </Button>
            </div>

            <div className="bg-lightGray p-6 rounded-lg shadow">
              <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-4">About the Provider</h3>
              <div className="flex items-center mb-3">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mr-4">
                  {provider.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-700">{provider.name}</h4>
                  <p className="text-sm text-primary">{provider.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">Member since {new Date(provider.createdAt).toLocaleDateString()}</p>
              <Link to={`/providers/${provider.id}`}>
                <Button variant="ghost" size="md" className="w-full text-primary hover:bg-primary/10">
                  View Provider Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 border-t border-gray-200">
          <h2 className="text-2xl font-poppins font-semibold text-gray-800 mb-6">Customer Reviews ({reviews.length})</h2>
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet for this service.</p>
          )}
          <div className="mt-8">
            <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-4">Leave a Review</h3>
            <ReviewForm contractId={service.id} onReviewSubmitted={handleReviewSubmitted} />
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Service Request">
        <div className="text-center">
          <p className="mb-4">You are about to request "{service.title}" from {provider.name}.</p>
          <p className="text-sm text-gray-500 mb-6">A notification will be sent to the provider. You can coordinate details in the chat.</p>
          <Button variant="primary" onClick={() => setIsModalOpen(false)} className="w-full">
            Confirm Request
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ServiceDetailPage;