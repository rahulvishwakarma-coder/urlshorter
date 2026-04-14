import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './App.css';

import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { Dashboard } from './components/dashboard/Dashboard';
import { Auth } from './Auth';
import { API_BASE_URL } from './constants';

axios.defaults.withCredentials = true;

function App() {
  const { user, login, logout, incrementTokens } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard'>('home');
  const [copied, setCopied] = useState(false);

  const handleLogout = async () => {
    await logout();
    setActiveTab('home');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showAuth && !user) {
    return (
      <div className="auth-overlay">
        <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
          <button
            onClick={() => setShowAuth(false)}
            className="copy-btn"
            style={{ padding: '0.5rem 1rem' }}
          >
            ← Back to Home
          </button>
        </div>
        <Auth onLogin={login} apiBaseUrl={API_BASE_URL} />
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <Navbar
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onShowAuth={() => setShowAuth(true)}
        onLogout={handleLogout}
      />

      <main className="container">
        <AnimatePresence mode="wait">
          {activeTab === 'home' ? (
            <HeroSection
              key="home"
              user={user}
              onRequireAuth={() => setShowAuth(true)}
              onTokenUsed={incrementTokens}
            />
          ) : (
            <Dashboard
              key="dashboard"
              onNavigateHome={() => setActiveTab('home')}
              onCopy={copyToClipboard}
            />
          )}
        </AnimatePresence>

        {/* ✅ Copied Feedback */}
        {copied && (
          <div className="copied-toast">
            Copied!
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;