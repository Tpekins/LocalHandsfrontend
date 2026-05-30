import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { StarIcon } from "../../components/icons/Icons";
import Button from "../../components/Button";
import ReviewCard from "../../components/ReviewCard";
import { User, Service, Review, Provider as ProviderType } from "../../types";
import api from "../../utils/api";

/*
 * ProviderProfilePage – GET /api/provider/:id + GET /api/services/provider/:providerId
 *
 * Data flow:
 *   On mount → api.get(`/provider/${providerId}`) fetches provider record
 *     → Backend includes: user (name, email, role, createdAt), services, availability
 *     → Extracts provider.user as the User object, provider.services as Service[]
 *
 *   Also fetches → api.get(`/services/provider/${providerId}`) for richer service list
 *     → Falls back to provider.services if the second call fails
 *
 * Reviews are not yet linked per-provider via a dedicated API endpoint.
 *
 * Full chain: React → api.ts (Bearer token interceptor) → NestJS → Prisma → PostgreSQL
 */
const ProviderProfilePage: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();

  const [provider, setProvider] = useState<User | null>(null);
  const [providerServices, setProviderServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // → Fetch provider + services + reviews in parallel
        const [providerRes, servicesRes] = await Promise.all([
          api.get<ProviderType>(`/provider/${providerId}`),
          api.get<Service[]>(`/services/provider/${providerId}`),
        ]);

        const providerData = providerRes.data;
        const providerUser = ((providerData as any).user as User) || null;
        setProvider(providerUser);
        setProviderServices(servicesRes.data);

        // → GET /api/review?reviewerId= for provider's reviews
        if (providerUser) {
          const reviewsRes = await api.get<Review[]>("/review", {
            params: { reviewerId: providerUser.id },
          });
          setProviderReviews(reviewsRes.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Provider not found.");
      } finally {
        setIsLoading(false);
      }
    };

    if (providerId) {
      fetchProvider();
    }
  }, [providerId]);

  const [providerReviews, setProviderReviews] = useState<Review[]>([]);

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-600">Loading provider profile...</p>
      </div>
    );
  }

  // Error or not found
  if (error || !provider) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl text-gray-700">
          {error || "Provider not found."}
        </h1>
        <Link to="/">
          <Button variant="primary" className="mt-4">
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  const averageRating =
    providerReviews.length > 0
      ? providerReviews.reduce((acc, review) => acc + review.rating, 0) /
        providerReviews.length
      : 0;

  const totalReviews = providerReviews.length;

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <StarIcon
          key={index}?.charAt(0)?.toUpperCase() ?? ''
          className={`w-5 h-5 ${index < Math.round(rating) ? "text-yellow-400" : "text-gray-300"}`}
          filled={index < Math.round(rating)}
        />
      ));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-32 h-32 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-bold mb-4 md:mb-0 md:mr-8">
            {provider.name?.charAt(0)?.toUpperCase() ?? ""}
          </div>
          <div>
            <h1 className="text-4xl font-bold font-poppins text-gray-800">
              {provider.name}
            </h1>
            <p className="text-lg text-primary font-semibold">
              {provider.role}
            </p>
            <p className="text-md text-gray-600 mt-2">
              Member since {new Date(provider.createdAt).toLocaleDateString()}
            </p>
            <div className="flex items-center mt-2">
              {renderStars(averageRating)}
              <span className="ml-2 text-gray-600">
                {averageRating.toFixed(1)} average rating from {totalReviews}{" "}
                reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-poppins font-semibold text-gray-800 mb-6">
          Services Offered
        </h2>
        {providerServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providerServices.map((service) => (
              <Link
                to={`/services/${service.id}`}
                key={service.id}
                className="block bg-white p-4 rounded-lg shadow hover:shadow-xl transition-shadow"
              >
                <img
                  src={
                    service.assets?.[0]?.imageUrl ||
                    "https://source.unsplash.com/random/400x300?sig=service"
                  }
                  alt={service.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-bold">{service.title}</h3>
                <p className="text-primary">{service.category?.name}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            This provider currently offers no services.
          </p>
        )}
      </div>

      <div>
        <h2 className="text-3xl font-poppins font-semibold text-gray-800 mb-6">
          Reviews
        </h2>
        {providerReviews.length > 0 ? (
          <div className="space-y-6">
            {providerReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            This provider has not received any reviews yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProviderProfilePage;
