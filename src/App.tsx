
import React from 'react';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ChatProvider } from './contexts/ChatContext';
import AppRouter from './router/AppRouter';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SettingsProvider>
          <ChatProvider>
            <HashRouter>
              <AppRouter />
            </HashRouter>
          </ChatProvider>
        </SettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
    