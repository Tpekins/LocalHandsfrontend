import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';

const OnboardingStep = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div>
    <h2 className="text-2xl font-semibold font-poppins text-primary mb-6">{title}</h2>
    {children}
  </div>
);

const ProviderOnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({ bio: '', avatarUrl: '' });
  const [serviceData, setServiceData] = useState({ title: '', description: '', price: '' });
  const navigate = useNavigate();

  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePrevStep = () => setStep(prev => prev - 1);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setServiceData({ ...serviceData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log('Onboarding data submitted:', { profileData, serviceData });
    alert('Onboarding complete! Welcome to your dashboard.');
    navigate('/provider/dashboard');
  };

  const totalSteps = 3;

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <Card className="p-8 md:p-10 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-center text-3xl font-poppins font-extrabold text-gray-800">Set Up Your Provider Profile</h1>
            <div className="mt-4 h-2 w-full bg-gray-200 rounded-full">
                <div 
                    className="h-2 bg-primary rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                ></div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">Step {step} of {totalSteps}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <OnboardingStep title="Step 1: Tell Us About Yourself">
                <div className="space-y-6">
                    <Input
                        label="Profile Picture URL"
                        name="avatarUrl"
                        type="text"
                        placeholder="https://example.com/your-photo.jpg"
                        value={profileData.avatarUrl}
                        onChange={handleProfileChange}
                    />
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Your Professional Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="Introduce yourself and your expertise..."
                            value={profileData.bio}
                            onChange={handleProfileChange}
                        ></textarea>
                    </div>
                </div>
              </OnboardingStep>
            )}

            {step === 2 && (
              <OnboardingStep title="Step 2: Define Your First Service">
                 <div className="space-y-6">
                    <Input
                        label="Service Title"
                        name="title"
                        type="text"
                        placeholder="e.g., Expert Plumbing Repair"
                        value={serviceData.title}
                        onChange={handleServiceChange}
                        required
                    />
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Service Description</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="Describe the service you offer..."
                            value={serviceData.description}
                            onChange={handleServiceChange}
                            required
                        ></textarea>
                    </div>
                    <Input
                        label="Starting Price (FCFA)"
                        name="price"
                        type="number"
                        placeholder="e.g., 5 000"
                        value={serviceData.price}
                        onChange={handleServiceChange}
                        required
                    />
                </div>
              </OnboardingStep>
            )}

            {step === 3 && (
              <OnboardingStep title="Step 3: Confirmation">
                <div className="text-center space-y-4">
                    <p className="text-lg text-gray-700">You're all set!</p>
                    <p className="text-gray-600">Review your information and click the button below to complete your profile and access your dashboard.</p>
                    {/* You can add a summary of the entered data here for review */}
                </div>
              </OnboardingStep>
            )}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <Button type="button" variant="secondary" onClick={handlePrevStep}>
                  Previous
                </Button>
              )}
              {step < totalSteps && (
                <Button type="button" variant="primary" onClick={handleNextStep} className="ml-auto">
                  Next
                </Button>
              )}
              {step === totalSteps && (
                <Button type="submit" variant="primary" className="ml-auto">
                  Complete Onboarding
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProviderOnboardingPage;
