import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link as LinkIcon, 
  Scissors, 
  Copy, 
  Check, 
  Zap, 
  Shield, 
  BarChart3, 
  ChevronDown, 
  ChevronUp,
  Loader2,
  ExternalLink,
  LogOut,
  Ticket,
  UserPlus,
  LogIn,
  LayoutDashboard,
  PlusCircle,
  Clock,
  MousePointer2,
  Calendar
} from 'lucide-react';
import axios from 'axios';
import { Auth } from './Auth';
import { Footer } from './Footer';

// Configure API base URL - adjust based on your backend environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Configure axios globally for credentials
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard'>('home');
  const [originalUrl, setOriginalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Dashboard states
  const [userUrls, setUserUrls] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/v1/me`);
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.log("No active session");
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user && activeTab === 'dashboard') {
      fetchUserUrls();
    }
  }, [user, activeTab]);

  const fetchUserUrls = async () => {
    setIsHistoryLoading(true);
    try {
      // The current backend route is POST /api/url/getUrls
      const response = await axios.post(`${API_BASE_URL}/api/url/getUrls`);
      setUserUrls(response.data.urls);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    setShowAuth(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/v1/logout`);
      setUser(null);
      setActiveTab('home');
    } catch (err) {
      console.error("Logout failed", err);
      setUser(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError("Please login to shorten URLs and manage your links.");
      setShowAuth(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/url/shorten`, {
        originalUrl,
        title: title || undefined,
        customCode: customCode || undefined
      });

      setResult(response.data.shortUrl);
      
      // Update tokens in UI locally
      setUser({
        ...user,
        tokensUsed: user.tokensUsed + 1
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
           <button onClick={() => setShowAuth(false)} className="copy-btn" style={{ padding: '0.5rem 1rem' }}>
             ← Back to Home
           </button>
        </div>
        <Auth onLogin={handleLogin} apiBaseUrl={API_BASE_URL} />
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <div className="container nav-content">
          <div className="logo" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
            <Scissors className="logo-icon" size={24} />
            <span>Short.ly</span>
          </div>
          
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {user ? (
              <>
                <div style={{ display: 'flex', gap: '0.5rem', marginRight: '1rem' }}>
                  <button 
                    onClick={() => setActiveTab('home')} 
                    className={`nav-link-btn ${activeTab === 'home' ? 'active' : ''}`}
                  >
                    <PlusCircle size={18} />
                    <span>Create</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('dashboard')} 
                    className={`nav-link-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </button>
                </div>

                <div className="token-badge" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  background: 'rgba(134, 59, 255, 0.1)', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '20px',
                  border: '1px solid var(--primary-glow)',
                  fontSize: '0.9rem'
                }}>
                  <Ticket size={16} color="var(--primary)" />
                  <span style={{ fontWeight: 600 }}>{user.tokenLimit - user.tokensUsed} Tokens</span>
                </div>
                
                <button onClick={handleLogout} className="logout-btn" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setShowAuth(true)} className="nav-btn-text" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                  <LogIn size={18} />
                  <span>Login</span>
                </button>
                <button onClick={() => setShowAuth(true)} className="submit-btn" style={{ marginTop: 0, padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                  <UserPlus size={18} />
                  <span>Get Started</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="container">
        <AnimatePresence mode="wait">
          {activeTab === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <section className="hero-section" style={{ paddingTop: '4rem' }}>
                <motion.h1 
                  className="hero-title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Shorten your links,<br />expand your reach.
                </motion.h1>
                {user ? (
                  <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Welcome back, {user.fullName}!</p>
                ) : (
                  <p className="hero-subtitle">
                    Create short, memorable, and trackable links in seconds. 
                    The professional way to share your content.
                  </p>
                )}

                <motion.div 
                  className="tool-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <div className="input-icon-wrapper">
                        <LinkIcon className="input-icon" size={20} />
                        <input 
                          type="url" 
                          placeholder="Paste your long URL here..." 
                          className="input-field"
                          value={originalUrl}
                          onChange={(e) => setOriginalUrl(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div 
                      className="advanced-toggle" 
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      style={{ cursor: 'pointer' }}
                    >
                      {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      <span>Advanced Options (Custom Code & Title)</span>
                    </div>

                    <AnimatePresence>
                      {showAdvanced && (
                        <motion.div 
                          className="advanced-options"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="form-group">
                            <input 
                              type="text" 
                              placeholder="Custom Title" 
                              className="input-field"
                              style={{ paddingLeft: '1rem' }}
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <input 
                              type="text" 
                              placeholder="Custom Suffix (e.g. promo2024)" 
                              className="input-field"
                              style={{ paddingLeft: '1rem' }}
                              value={customCode}
                              onChange={(e) => setCustomCode(e.target.value)}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={isLoading || !originalUrl || (user && user.tokenLimit - user.tokensUsed <= 0)}
                    >
                      {isLoading ? (
                        <Loader2 className="loading-spinner" size={20} />
                      ) : (
                        <>
                          <Scissors size={20} />
                          <span>{user && user.tokenLimit - user.tokensUsed <= 0 ? 'Out of Tokens' : 'Shorten URL'}</span>
                        </>
                      )}
                    </button>

                    {error && (
                      <motion.p 
                        className="error-msg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {error}
                      </motion.p>
                    )}
                  </form>

                  <AnimatePresence>
                    {result && (
                      <motion.div 
                        className="result-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="result-info">
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Your shortened URL:</p>
                          <a href={result} target="_blank" rel="noopener noreferrer" className="short-url">
                            {result} <ExternalLink size={14} style={{ display: 'inline' }} />
                          </a>
                        </div>
                        <button 
                          className="copy-btn" 
                          onClick={() => copyToClipboard(result)}
                          style={{ background: copied ? 'var(--success)' : 'rgba(255,255,255,0.1)' }}
                        >
                          {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </section>

              <section className="features-grid">
                <FeatureCard 
                  icon={<Zap />}
                  title="Lightning Fast"
                  desc="Our infrastructure ensures your redirects are as fast as a blink of an eye."
                />
                <FeatureCard 
                  icon={<Shield />}
                  title="Secure & Reliable"
                  desc="Every link is checked for security and we guarantee 99.9% uptime for your links."
                />
                <FeatureCard 
                  icon={<BarChart3 />}
                  title="Advanced Analytics"
                  desc="Track clicks, geographic data, and referrers for all your shortened links."
                />
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="dashboard-container"
              style={{ paddingTop: '2rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Your Dashboard</h1>
                  <p style={{ color: 'var(--text-muted)' }}>Manage and track your shortened links</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{userUrls.length}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Links</div>
                </div>
              </div>

              {isHistoryLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                  <Loader2 className="loading-spinner" size={40} color="var(--primary)" />
                </div>
              ) : userUrls.length === 0 ? (
                <div className="tool-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                  <Clock size={48} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', opacity: 0.5 }} />
                  <h3>No links yet</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You haven't shortened any links yet. Start creating now!</p>
                  <button onClick={() => setActiveTab('home')} className="submit-btn" style={{ maxWidth: '200px', margin: '0 auto' }}>
                    Create First Link
                  </button>
                </div>
              ) : (
                <div className="links-grid">
                  {userUrls.map((url) => (
                    <motion.div 
                      key={url._id} 
                      className="url-history-card"
                      layout
                    >
                      <div className="url-header">
                        <div className="url-title-group">
                          <h3 className="url-title">{url.title || 'Untitled Link'}</h3>
                          <a href={url.originalUrl} target="_blank" rel="noopener noreferrer" className="url-original">
                            {url.originalUrl}
                          </a>
                        </div>
                        <div className="url-clicks">
                          <MousePointer2 size={16} />
                          <span>{url.clicks} clicks</span>
                        </div>
                      </div>

                      <div className="url-body">
                        <div className="url-short-group">
                          <span className="short-label">Short URL</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <a href={`${API_BASE_URL}/${url.shortCode}`} target="_blank" rel="noopener noreferrer" className="short-value">
                              {url.shortCode}
                            </a>
                            <button 
                              onClick={() => copyToClipboard(`${API_BASE_URL}/${url.shortCode}`)}
                              className="mini-copy-btn"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="url-meta">
                          <div className="meta-item">
                            <Calendar size={14} />
                            <span>{new Date(url.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      className="feature-card"
      whileHover={{ y: -5 }}
    >
      <div className="feature-icon">
        {icon}
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
    </motion.div>
  );
}

export default App;
