import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { DUMMY_USERS, DUMMY_SERVICES, DUMMY_REVIEWS } from '../../utils/dummyData';
import { UserCircleIcon, StarIcon } from '../../components/icons/Icons';
import Button from '../../components/Button';
import ReviewCard from '../../components/ReviewCard';

const ProviderProfilePage: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();

  const provider = DUMMY_USERS.find(u => u.id === providerId);
  const providerServices = DUMMY_SERVICES.filter(s => s.providerId === providerId);
  const providerServiceIds = providerServices.map(s => s.id);
  const providerReviews = DUMMY_REVIEWS.filter(r => providerServiceIds.includes(r.serviceId));

  if (!provider) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl text-gray-700">Provider not found.</h1>
        <Link to="/">
          <Button variant="primary" className="mt-4">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const averageRating = providerServices.length > 0
    ? providerServices.reduce((acc, service) => acc + service.rating, 0) / providerServices.length
    : 0;

  const totalReviews = providerServices.reduce((acc, service) => acc + service.reviewsCount, 0);

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <StarIcon key={index} className={`w-5 h-5 ${index < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} filled={index < Math.round(rating)} />
    ));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center">
          {provider.avatar ? (
            <img src={provider.avatar} alt={provider.name} className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-8" />
          ) : (
            <UserCircleIcon className="w-32 h-32 text-gray-400 mb-4 md:mb-0 md:mr-8" />
          )}
          <div>
            <h1 className="text-4xl font-bold font-poppins text-gray-800">{provider.name}</h1>
            <p className="text-lg text-primary font-semibold">{provider.role}</p>
            <p className="text-md text-gray-600 mt-2">Member since {new Date(provider.registeredAt).toLocaleDateString()}</p>
            <div className="flex items-center mt-2">
              {renderStars(averageRating)}
              <span className="ml-2 text-gray-600">
                {averageRating.toFixed(1)} average rating from {totalReviews} reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-poppins font-semibold text-gray-800 mb-6">Services Offered</h2>
        {providerServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providerServices.map(service => (
              <Link to={`/services/${service.id}`} key={service.id} className="block bg-white p-4 rounded-lg shadow hover:shadow-xl transition-shadow">
                <img src={service.images[0]} alt={service.title} className="w-full h-40 object-cover rounded-md mb-4" />
                <h3 className="text-lg font-bold">{service.title}</h3>
                <p className="text-primary">{service.category.name}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">This provider currently offers no services.</p>
        )}
      </div>

      <div>
        <h2 className="text-3xl font-poppins font-semibold text-gray-800 mb-6">Reviews</h2>
        {providerReviews.length > 0 ? (
          <div className="space-y-6">
            {providerReviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">This provider has not received any reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProviderProfilePage;
