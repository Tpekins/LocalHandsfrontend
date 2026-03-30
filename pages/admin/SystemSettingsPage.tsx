import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import TextArea from '../../components/TextArea';

const SystemSettingsPage: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const [formState, setFormState] = useState(settings);

  useEffect(() => {
    setFormState(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormState(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings = {
      ...formState,
      platformFee: Number(formState.platformFee) || 0,
    };
    setSettings(updatedSettings);
    alert('System settings saved!');
  };

  return (
    <div>
      <h1 className="text-3xl font-poppins font-bold text-gray-800 mb-8">System Settings</h1>
      
      <Card className="p-6 md:p-8 shadow-xl mb-8">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-4">General Settings</h2>
          <div className="space-y-4">
            <Input name="platformName" label="Platform Name" value={formState.platformName} onChange={handleChange} />
            <Input name="supportEmail" label="Support Email" value={formState.supportEmail} onChange={handleChange} />
            <Input name="platformFee" label="Platform Fee (%)" type="number" min="0" max="50" value={formState.platformFee} onChange={handleChange} />
          </div>

          <hr className="my-6" />

          <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-4">Feature Toggles</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-900">Allow New Registrations</span>
              <input type="checkbox" name="allowNewRegistrations" checked={formState.allowNewRegistrations} onChange={handleChange} className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-900">Require Email Verification</span>
              <input type="checkbox" name="requireEmailVerification" checked={formState.requireEmailVerification} onChange={handleChange} className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-900">Enable Review System</span>
              <input type="checkbox" name="enableReviewSystem" checked={formState.enableReviewSystem} onChange={handleChange} className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-900">Enable Messaging</span>
              <input type="checkbox" name="enableMessaging" checked={formState.enableMessaging} onChange={handleChange} className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
            </div>
          </div>

          <hr className="my-6" />

          <h2 className="text-xl font-poppins font-semibold text-gray-700 mb-4">Email Templates</h2>
          <div className="space-y-4">
            <TextArea name="welcomeEmail" label="Welcome Email Template" rows={4} value={formState.welcomeEmail} onChange={handleChange} />
            <TextArea name="verificationEmail" label="Verification Email Template" rows={4} value={formState.verificationEmail} onChange={handleChange} />
          </div>

          <div className="flex justify-end mt-8">
            <Button type="submit" variant='primary' size='lg'>
              Save Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SystemSettingsPage;
