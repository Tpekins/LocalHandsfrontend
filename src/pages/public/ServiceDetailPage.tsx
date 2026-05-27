
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DUMMY_SERVICES, DUMMY_REVIEWS, DUMMY_USERS } from '../../utils/dummyData';
import { useAuth } from '../../contexts/AuthContext';
import { Service, Review as ReviewType, Role } from '../../types';
import { formatCurrency } from '../../utils/currency';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import ReviewCard from '../../components/ReviewCard';
import { StarIcon, UserCircleIcon } from '../../components/icons/Icons';
import ReviewForm from '../../components/ReviewForm';

const ServiceDetailPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const servicesFromStorage = localStorage.getItem('DUMMY_SERVICES_TEMP');
  const allServices = servicesFromStorage ? JSON.parse(servicesFromStorage) : DUMMY_SERVICES;
  const service = allServices.find((s: Service) => s.id === serviceId);
  const provider = DUMMY_USERS.find(u => u.id === service?.providerId);
  const reviews = DUMMY_REVIEWS.filter(r => r.serviceId === serviceId);

  const handleRequestService = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: location.pathname } });
    } else {
      setIsModalOpen(true);
    }
  };

  const handleMessageProvider = () => {
    if (!provider) return;
    if (!currentUser) {
      // not logged in – redirect to login then back here
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    // direct the user to the appropriate chat area based on their role
    if (currentUser.role === Role.CLIENT) {
      navigate(`/client/chat?recipientId=${provider.id}`);
    } else if (currentUser.role === Role.PROVIDER) {
      navigate(`/provider/chat?recipientId=${provider.id}`);
    } else {
      // default fallback (guests / admins) – you could adjust this as needed
      navigate(`/client/chat?recipientId=${provider.id}`);
    }
  };

  const handleReviewSubmitted = (review: ReviewType) => {
    console.log('Review submitted:', review);
    // In a real app, this would update the reviews list
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

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <StarIcon key={index} className={`w-6 h-6 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`} filled={index < rating} />
    ));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="relative">
          <img 
            src={service.images[0] || 'https://source.unsplash.com/random/1200x500?sig=service-detail'} 
            alt={service.title} 
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <span className="bg-secondary text-gray-800 px-3 py-1 rounded-full text-sm font-semibold mb-2 inline-block">{service.category.name}</span>
            <h1 className="text-3xl md:text-4xl font-poppins font-bold text-white mb-2">{service.title}</h1>
            <div className="flex items-center text-yellow-300">
              {renderStars(service.rating)}
              <span className="ml-2 text-white text-lg">({service.rating.toFixed(1)} from {service.reviewsCount} reviews)</span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-poppins font-semibold text-gray-800 mb-4">Service Description</h2>
            <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">{service.description}</p>
            
            <div className="mb-6">
                 <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-3">Service Details</h3>
                 <ul className="space-y-2 text-gray-600">
                     <li><strong>Location:</strong> {service.location || 'Not specified'}</li>
                     <li><strong>Price Type:</strong> {service.priceType.charAt(0).toUpperCase() + service.priceType.slice(1)}</li>
                 </ul>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-lightGray p-6 rounded-lg shadow">
              <h2 className="text-2xl font-poppins font-semibold text-primary mb-4">
                {formatCurrency(service.price)}
                {service.priceType === 'hourly' && <span className="text-sm text-gray-500 font-normal"> / hour</span>}
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
                {provider.avatar ? (
                    <img 
                    src={provider.avatar} 
                    alt={provider.name} 
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                ) : (
                    <UserCircleIcon className="w-16 h-16 text-gray-400 mr-4" />
                )}
                <div>
                  <h4 className="text-lg font-semibold text-gray-700">{provider.name}</h4>
                  <p className="text-sm text-primary">{provider.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">Member since {new Date(provider.registeredAt).toLocaleDateString()}</p>
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
            <ReviewForm serviceId={service.id} onReviewSubmitted={handleReviewSubmitted} />
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
