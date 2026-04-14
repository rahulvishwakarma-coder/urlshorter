import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link as LinkIcon,
  Scissors,
  ChevronDown,
  ChevronUp,
  Loader2,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import axios, { AxiosError } from 'axios';
import type { User, ApiErrorResponse } from '../../types';
import { API_BASE_URL } from '../../constants';

interface UrlShortenerFormProps {
  user: User | null;
  onRequireAuth: () => void;
  onTokenUsed: () => void;
}

export function UrlShortenerForm({
  user,
  onRequireAuth,
  onTokenUsed,
}: UrlShortenerFormProps) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const tokensLeft = user ? user.tokenLimit - user.tokensUsed : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Please login to shorten URLs and manage your links.');
      onRequireAuth();
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post<{ shortUrl: string }>(
        `${API_BASE_URL}/api/url/shorten`,
        { originalUrl, title: title || undefined, customCode: customCode || undefined }
      );
      setResult(response.data.shortUrl);
      onTokenUsed();
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      setError(
        axiosErr.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
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
          disabled={isLoading || !originalUrl || tokensLeft <= 0}
        >
          {isLoading ? (
            <Loader2 className="loading-spinner" size={20} />
          ) : (
            <>
              <Scissors size={20} />
              <span>{user && tokensLeft <= 0 ? 'Out of Tokens' : 'Shorten URL'}</span>
            </>
          )}
        </button>

        {error && (
          <motion.p className="error-msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Your shortener URL:
              </p>
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
  );
}