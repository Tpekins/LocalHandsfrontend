
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
import Button from './Button';
import { APP_NAME, PUBLIC_NAV_ITEMS, DEFAULT_AVATAR } from '../constants';
import { MenuIcon, XIcon, LogoutIcon, UserCircleIcon, CogIcon, BellIcon } from '../components/icons/Icons';
import NotificationPanel, { Notification } from './notifications/NotificationPanel';

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'admin',
    message: 'A new job has been posted by a client.',
    timestamp: '2025-06-25 23:55',
    read: false,
  },
  {
    id: '2',
    type: 'client',
    message: 'A new proposal has been received for your job post.',
    timestamp: '2025-06-25 22:40',
    read: true,
  },
  {
    id: '3',
    type: 'provider',
    message: 'Your proposal for a job has been accepted.',
    timestamp: '2025-06-25 20:10',
    read: false,
  },
];

const Header: React.FC = () => {
  const { currentUser, currentRole, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };
  
  const getDashboardPath = () => {
    switch(currentRole) {
      case Role.CLIENT: return '/client/dashboard';
      case Role.PROVIDER: return '/provider/dashboard';
      case Role.ADMIN: return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src={'/assets/local-hands-logo.png'}
              alt="Local Hands Logo"
              className="h-10 w-10 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
              style={{ minWidth: 40 }}
            />
            <span className="text-3xl font-poppins font-bold text-primary">{APP_NAME}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-gray-600 hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {currentUser.avatar ? (
                    <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={currentUser.avatar || DEFAULT_AVATAR}
                        alt={currentUser.name}
                    />
                    ) : (
                        <UserCircleIcon className="h-10 w-10 text-gray-400" />
                    )}
                   <span className="text-sm font-medium text-gray-700 hidden lg:inline">{currentUser.name || currentUser.email}</span>
                  {/* ChevronDownIcon can be added here */}
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >
                      My Dashboard
                    </Link>
                    <Link
                      to={`/${(currentRole ? currentRole.toLowerCase() : 'client')}/settings`} // Example path
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >
                       <CogIcon className="w-4 h-4 mr-2" /> Settings
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsNotificationPanelOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >
                      <BellIcon className="w-4 h-4 mr-2" /> Notifications
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >
                      <LogoutIcon className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="outline" size="md" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button variant="primary" size="md" onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-primary focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
          <nav className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-4 pb-3 border-t border-gray-200">
             {currentUser ? (
              <>
                <div className="px-5 flex items-center">
                    {currentUser.avatar ? (
                        <img className="h-10 w-10 rounded-full object-cover" src={currentUser.avatar || DEFAULT_AVATAR} alt={currentUser.name} />
                    ) : (
                        <UserCircleIcon className="h-10 w-10 text-gray-400" />
                    )}
                    <div className="ml-3">
                        <p className="text-base font-medium text-gray-800">{currentUser.name || currentUser.email}</p>
                        <p className="text-sm font-medium text-gray-500">{currentUser.email}</p>
                    </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                     <Link
                      to={getDashboardPath()}
                      onClick={() => { setIsMobileMenuOpen(false); }}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >
                      My Dashboard
                    </Link>
                     <Link
                      to={`/${currentRole.toLowerCase()}/settings`}
                      onClick={() => { setIsMobileMenuOpen(false); }}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >
                      <CogIcon className="w-5 h-5 mr-2" /> Settings
                    </Link>
                    <button
                        type="button"
                        onClick={() => {
                          setIsNotificationPanelOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >
                        <BellIcon className="w-5 h-5 mr-2" /> Notifications
                    </button>
                    <button
                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                        className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >
                        <LogoutIcon className="w-5 h-5 mr-2" /> Logout
                    </button>
                </div>
            </>) : (
                <div className="px-2 space-y-2">
                    <Button variant="outline" size="md" className="w-full" onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}>
                        Login
                    </Button>
                    <Button variant="primary" size="md" className="w-full" onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}>
                        Sign Up
                    </Button>
                </div>
            )}
          </div>
        </div>
      )}
      {/* Notification Panel Overlay */}
      <NotificationPanel
        open={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
        notifications={mockNotifications}
      />
    </header>
  );
};

export default Header;
