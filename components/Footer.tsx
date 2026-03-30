import React from 'react';
import { Role } from '../types';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { APP_NAME } from '../constants';

// Placeholder for Social Icons - In a real app, you would create these as proper SVG components
const SocialIconPlaceholder = ({ name }: { name: string }) => (
  <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
    {name}
  </div>
);

const Footer: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <footer className="bg-slate-800 text-gray-300 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

          {/* Column 1: Company Info & Socials */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 mb-8 lg:mb-0">
            <h3 className="text-2xl font-bold text-white mb-4">{APP_NAME}</h3>
            <p className="text-gray-400 mb-6">
              Your trusted marketplace for local services. Connecting communities, one job at a time.
            </p>
            <div className="flex space-x-4">
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white"><SocialIconPlaceholder name="Fb" /></a>
                            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-white"><SocialIconPlaceholder name="Tw" /></a>
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white"><SocialIconPlaceholder name="In" /></a>
            </div>
          </div>

          {/* Column 2: For Customers */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Customers</h4>
            <ul className="space-y-3">
              <li><Link to="/services" className="hover:text-white transition-colors">Browse Services</Link></li>
              <li>
                {currentUser ? (
                  <Link to="/dashboard" className="hover:text-white transition-colors">My Account</Link>
                ) : (
                  <Link to="/login" className="hover:text-white transition-colors">Log In</Link>
                )}
              </li>
              <li><Link to="/faq" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/trust-and-safety" className="hover:text-white transition-colors">Trust & Safety</Link></li>
            </ul>
          </div>

          {/* Column 3: For Providers */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Providers</h4>
            <ul className="space-y-3">
              <li><Link to="/providers/why-local-hands" className="hover:text-white transition-colors">Why Join Us</Link></li>
              <li>
                {currentUser?.role === Role.PROVIDER ? (
                  <Link to="/provider/dashboard" className="hover:text-white transition-colors">Provider Dashboard</Link>
                ) : currentUser?.role === Role.CLIENT ? (
                  <Link to="/provider/apply" className="hover:text-white transition-colors">Become a Provider</Link>
                ) : (
                  <Link to="/register-provider" className="hover:text-white transition-colors">Become a Provider</Link>
                )}
              </li>
              <li><Link to="/providers/safety" className="hover:text-white transition-colors">Provider Safety</Link></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Column 5: Support & Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support & Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
             <Link to="/cookie-policy" className="text-gray-300 hover:text-white transition-colors text-sm">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;