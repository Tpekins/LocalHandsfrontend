
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import { DUMMY_CATEGORIES, DUMMY_TESTIMONIALS } from '../../utils/dummyData';
import { Category, Testimonial } from '../../types';
import Card from '../../components/Card';
import { HOW_IT_WORKS_STEPS }  from '../../constants';

const HeroSection: React.FC = () => (
  <section 
    className="bg-gradient-to-r from-primary via-teal-600 to-teal-700 text-white py-20 md:py-32 rounded-lg shadow-xl mb-16"
    // style={{ backgroundImage: "url('https://picsum.photos/seed/hero/1920/1080')", backgroundSize: 'cover', backgroundPosition: 'center' }}
  >
    <div className="container mx-auto px-6 text-center">
      {/* <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div> */}
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
        {HOW_IT_WORKS_STEPS.map((step,) => (
          <Card key={step.id} className="p-6 hover:shadow-primary/20">
            <div className="flex items-center mb-4">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">
                {step.id}
              </div>
              {/* Ensure CheckCircleIcon here is used if it was intended for these steps, or use step.icon as defined in constants */}
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

const FeaturedCategoriesSection: React.FC<{ categories: Category[] }> = ({ categories }) => (
  <section className="py-16 bg-lightGray rounded-lg shadow-lg mb-16">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-3xl font-poppins font-semibold text-gray-800 mb-2">Featured Categories</h2>
      <p className="text-gray-600 mb-12 max-w-xl mx-auto">Explore popular services offered by our talented providers.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.slice(0,5).map((category) => (
          <Link key={category.id} to={`/services?category=${category.id}`}>
            <Card className="p-6 text-center group hover:bg-primary transition-colors duration-300">
              {category.icon ? <category.icon className="w-16 h-16 text-primary mx-auto mb-4 group-hover:text-white transition-colors" /> : 
              <img src={category.imageUrl || `https://picsum.photos/seed/${category.id}/100/100`} alt={category.name} className="w-16 h-16 rounded-full mx-auto mb-4" />
              }
              <h3 className="text-md font-poppins font-semibold text-gray-700 group-hover:text-white transition-colors">{category.name}</h3>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsSection: React.FC<{ testimonials: Testimonial[] }> = ({ testimonials }) => (
  <section className="py-16 bg-white rounded-lg shadow-lg">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-3xl font-poppins font-semibold text-gray-800 mb-2">What Our Users Say</h2>
      <p className="text-gray-600 mb-12 max-w-xl mx-auto">Hear from satisfied clients and providers who love LocalHands.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.slice(0,3).map((testimonial) => (
          <Card key={testimonial.id} className="p-8 text-left bg-gray-50">
            <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full mb-4 shadow-md"/>
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
  return (
    <div className="space-y-16 md:space-y-24">
      <HeroSection />
      <HowItWorksSection />
      <FeaturedCategoriesSection categories={DUMMY_CATEGORIES} />
      <TestimonialsSection testimonials={DUMMY_TESTIMONIALS} />
      <CTASection />
    </div>
  );
};

export default HomePage;
