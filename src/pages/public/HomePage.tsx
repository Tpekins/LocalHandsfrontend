
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import { Category, Service, Testimonial } from '../../types';
import Card from '../../components/Card';
import ServiceCard from '../../components/ServiceCard';
import api from '../../utils/api';
import { HOW_IT_WORKS_STEPS } from '../../constants';

/*
 * HomePage – GET /api/services/featured + GET /api/category
 *
 * Data flow:
 *   On mount → api.get("/services/featured") fetches top 6 available services
 *     → Backend: service.service.findFeatured() → Prisma findMany with limit
 *     → Displayed in the "Featured Services" section below the hero
 *
 *   On mount → api.get("/category") fetches all categories
 *     → Displayed in the "Featured Categories" section
 *     → Each category links to /services?category={id}
 *
 * Testimonials are static local data (no API endpoint yet).
 *
 * Full chain: React → api.ts (Bearer token interceptor) → NestJS backend → Prisma → PostgreSQL
 */

// Static testimonials (no backend endpoint yet)
const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Marie N.',
    role: 'Client',
    avatar: 'https://i.pravatar.cc/150?img=1',
    text: 'LocalHands connected me with an amazing electrician in under an hour. The whole process was smooth and secure.',
  },
  {
    id: '2',
    name: 'Jean-Paul K.',
    role: 'Client',
    avatar: 'https://i.pravatar.cc/150?img=3',
    text: 'I posted a job for a logo design and received quality proposals within minutes. Highly recommended!',
  },
  {
    id: '3',
    name: 'Sophie T.',
    role: 'Provider',
    avatar: 'https://i.pravatar.cc/150?img=5',
    text: 'As a provider, this platform has helped me grow my client base and manage bookings effortlessly.',
  },
];

const HeroSection: React.FC = () => (
  <section
    className="bg-gradient-to-r from-primary via-teal-600 to-teal-700 text-white py-20 md:py-32 rounded-lg shadow-xl mb-16"
  >
    <div className="container mx-auto px-6 text-center">
      <div className="relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-poppins font-bold mb-6 leading-tight">
          Welcome to LocalHands
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Connect with skilled local professionals for any service you need. Fast, reliable, and right in your neighborhood.
        </p>
        <div className="space-x-4">
          <Link to="/services">
            <Button variant="secondary" size="lg">Browse Services</Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-teal-500 hover:text-white hover:opacity-90 transition duration-150 ease-in-out">Become a Provider</Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const HowItWorksSection: React.FC = () => (
  <section className="py-16 bg-white rounded-lg shadow-lg mb-16">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-3xl font-poppins font-semibold text-gray-800 mb-2">How It Works</h2>
      <p className="text-gray-600 mb-12 max-w-xl mx-auto">Getting things done has never been easier. Follow these simple steps.</p>
      <div className="grid md:grid-cols-3 gap-8 text-left">
        {HOW_IT_WORKS_STEPS.map((step) => (
          <Card key={step.id} className="p-6 hover:shadow-primary/20">
            <div className="flex items-center mb-4">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">
                {step.id}
              </div>
              {step.icon && <step.icon className="w-10 h-10 text-primary" />}
            </div>
            <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

// → GET /api/services/featured
const FeaturedServicesSection: React.FC<{ services: Service[]; isLoading: boolean }> = ({ services, isLoading }) => (
  <section className="py-16 bg-white rounded-lg shadow-lg mb-16">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-3xl font-poppins font-semibold text-gray-800 mb-2">Featured Services</h2>
      <p className="text-gray-600 mb-12 max-w-xl mx-auto">Top-rated services from our trusted providers.</p>
      {isLoading ? (
        <p className="text-gray-500">Loading featured services...</p>
      ) : Array.isArray(services) && services.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No featured services available right now.</p>
      )}
      <div className="mt-8">
        <Link to="/services">
          <Button variant="primary" size="lg">View All Services</Button>
        </Link>
      </div>
    </div>
  </section>
);

// → GET /api/category
const FeaturedCategoriesSection: React.FC<{ categories: Category[]; isLoading: boolean }> = ({ categories, isLoading }) => (
  <section className="py-16 bg-lightGray rounded-lg shadow-lg mb-16">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-3xl font-poppins font-semibold text-gray-800 mb-2">Featured Categories</h2>
      <p className="text-gray-600 mb-12 max-w-xl mx-auto">Explore popular services offered by our talented providers.</p>
      {isLoading ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : Array.isArray(categories) && categories.length > 0 ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.slice(0, 10).map((category) => (
          <Link key={category.id} to={`/services?category=${category.id}`}>
            <Card className="p-6 text-center group hover:bg-primary transition-colors duration-300">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 group-hover:bg-white group-hover:text-primary transition-colors">
                {category.name.charAt(0)}
              </div>
              <h3 className="text-md font-poppins font-semibold text-gray-700 group-hover:text-white transition-colors">{category.name}</h3>
            </Card>
          </Link>
        ))}
      </div>
      ) : (
        <p className="text-gray-500">No categories available.</p>
      )}
    </div>
  </section>
);

const TestimonialsSection: React.FC<{ testimonials: Testimonial[] }> = ({ testimonials }) => (
  <section className="py-16 bg-white rounded-lg shadow-lg">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-3xl font-poppins font-semibold text-gray-800 mb-2">What Our Users Say</h2>
      <p className="text-gray-600 mb-12 max-w-xl mx-auto">Hear from satisfied clients and providers who love LocalHands.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.slice(0, 3).map((testimonial) => (
          <Card key={testimonial.id} className="p-8 text-left bg-gray-50">
            <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full mb-4 shadow-md" />
            <p className="text-gray-700 italic mb-4 leading-relaxed">"{testimonial.text}"</p>
            <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
            <p className="text-sm text-gray-500">{testimonial.role}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const CTASection: React.FC = () => (
  <section className="py-16 bg-primary text-white rounded-lg shadow-lg">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-3xl font-poppins font-semibold mb-2">Ready to Get Started?</h2>
      <p className="text-lg md:text-xl mb-12 max-w-xl mx-auto">Join thousands of satisfied customers and service providers on LocalHands</p>
      <div className="space-x-4">
        <Link to="/register">
          <Button variant="secondary" size="lg">Find Services</Button>
        </Link>
        <Link to="/register">
          <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-primary">Offer Services</Button>
        </Link>
      </div>
    </div>
  </section>
);

const HomePage: React.FC = () => {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFeaturedLoading(true);
        setIsCategoriesLoading(true);

        // → Parallel fetch: featured services + categories
        const [featuredRes, categoriesRes] = await Promise.all([
          api.get<Service[]>('/services/featured', { params: { limit: 6 } }),
          api.get<Category[]>('/category'),
        ]);

        setFeaturedServices(Array.isArray(featuredRes.data) ? featuredRes.data : []);
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      } catch (err) {
        // Silently degrade — sections will show empty state
      } finally {
        setIsFeaturedLoading(false);
        setIsCategoriesLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 md:space-y-24">
      <HeroSection />
      <HowItWorksSection />
      <FeaturedServicesSection services={featuredServices} isLoading={isFeaturedLoading} />
      <FeaturedCategoriesSection categories={categories} isLoading={isCategoriesLoading} />
      <TestimonialsSection testimonials={MOCK_TESTIMONIALS} />
      <CTASection />
    </div>
  );
};

export default HomePage;
