import { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import axios from 'axios';
import './App.css';

// Configure API base URL - adjust based on your backend environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <div className="container nav-content">
          <div className="logo">
            <Scissors className="logo-icon" size={24} />
            <span>Short.ly</span>
          </div>
          <div className="nav-links">
            <a href="https://github.com/rahulvishwakarma-coder/urlshorter" target="_blank" rel="noopener noreferrer" className="copy-btn">
              <BarChart3 size={20} />
            </a>
          </div>
        </div>
      </nav>

      <main className="container">
        <section className="hero-section">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Shorten your links,<br />expand your reach.
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Create short, memorable, and trackable links in seconds. 
            The professional way to share your content.
          </motion.p>

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
                disabled={isLoading || !originalUrl}
              >
                {isLoading ? (
                  <Loader2 className="loading-spinner" size={20} />
                ) : (
                  <>
                    <Scissors size={20} />
                    <span>Shorten URL</span>
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
                    onClick={copyToClipboard}
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
      </main>

      <footer style={{ padding: '2rem 0', textAlign: 'center', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>© 2026 Short.ly - Modern URL Shortener. Built with React & Node.js</p>
      </footer>
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
