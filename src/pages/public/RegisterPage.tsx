
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import { APP_NAME } from '../../constants';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import * as flags from 'country-flag-icons/react/3x2';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role | ''>('');
  const [isRoleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (!role) {
      toast.error('Please select a role.');
      return;
    }
    if (!phone) {
      toast.error('Please enter a phone number.');
      return;
    }

    setIsLoading(true);

    // Use the register function from AuthContext
    const result = await register(name, phone!, email, password, role);

    if (result.success) {
      toast.success(result.message);
      navigate('/login', { state: { message: result.message } });
    } else {
      toast.error(result.message);
    }

    setIsLoading(false);
  };

  const roleOptions = [
    { value: Role.CLIENT, label: 'a Client looking for a service' },
    { value: Role.PROVIDER, label: 'a Provider offering a service' },
  ];

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setRoleDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="p-8 md:p-10 shadow-2xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-poppins font-extrabold text-primary">
              Create your {APP_NAME} account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <Input
              label="Full Name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
            />
            <PhoneInput
              id="phone"
              name="phone"
              value={phone}
              onChange={setPhone}
              className="mb-4 w-full"
              flags={flags}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />

            {/* Custom Role Selector */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">I am...</label>
              <button
                type="button"
                className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                onClick={() => setRoleDropdownOpen(!isRoleDropdownOpen)}
              >
                <span className={`block truncate ${role ? 'text-gray-900' : 'text-gray-500'}`}>
                  {role ? roleOptions.find(o => o.value === role)?.label : 'I am...'}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
                  <ul className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {roleOptions.map((option) => (
                      <li
                        key={option.value}
                        className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-primary hover:text-white"
                        onClick={() => handleRoleSelect(option.value)}
                      >
                        <span className="font-normal block truncate">{option.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading} disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-accent">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
    