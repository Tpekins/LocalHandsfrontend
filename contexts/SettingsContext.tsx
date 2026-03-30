import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of your settings
interface SystemSettings {
  platformName: string;
  supportEmail: string;
  platformFee: number;
  allowNewRegistrations: boolean;
  requireEmailVerification: boolean;
  enableReviewSystem: boolean;
  enableMessaging: boolean;
  welcomeEmail: string;
  verificationEmail: string;
}

// Define the context type
interface SettingsContextType {
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
}

// Create the context with a default value
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Create a provider component
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SystemSettings>({
    platformName: 'LocalHands',
    supportEmail: 'support@localhands.com',
    platformFee: 10,
    allowNewRegistrations: true,
    requireEmailVerification: true,
    enableReviewSystem: true,
    enableMessaging: true,
    welcomeEmail: 'Welcome to LocalHands...',
    verificationEmail: 'Your account has been verified...',
  });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Create a custom hook to use the settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
