import { motion } from 'framer-motion';
import {
  MousePointer2,
  Trash2,
  Loader2,
  ExternalLink,
  Copy,
  Calendar,
} from 'lucide-react';
import type { UrlEntry } from '../../types';
import { API_BASE_URL } from '../../constants';

interface UrlCardProps {
  url: UrlEntry;
  isDeleting: boolean;
  isConfirming: boolean;
  isRedirecting: boolean;
  onDelete: (shortCode: string, id: string) => void;
  onRedirect: (shortCode: string, id: string, fallback: string) => void;
  onCopy: (text: string) => void;
}

export function UrlCard({
  url,
  isDeleting,
  isConfirming,
  isRedirecting,
  onDelete,
  onRedirect,
  onCopy,
}: UrlCardProps) {
  return (
    <motion.div
      className="url-history-card"
      layout
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="url-header">
        <div className="url-title-group">
          <h3 className="url-title">{url.title || 'Untitled Link'}</h3>
          <a
            href={url.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="url-original"
          >
            {url.originalUrl}
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="url-clicks">
            <MousePointer2 size={16} />
            <span>{url.clicks} clicks</span>
          </div>

          <button
            onClick={() => onDelete(url.shortCode, url._id)}
            disabled={isDeleting}
            title={isConfirming ? 'Click again to confirm deletion' : 'Delete this link'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.7rem',
              borderRadius: '8px',
              border: 'none',
              outline: isConfirming
                ? '1px solid rgba(239, 68, 68, 0.5)'
                : '1px solid rgba(239, 68, 68, 0.15)',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              fontSize: '0.78rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              background: isConfirming ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.08)',
              color: isConfirming ? '#ef4444' : 'rgba(239, 68, 68, 0.6)',
            }}
          >
            {isDeleting ? (
              <Loader2 size={14} className="loading-spinner" />
            ) : (
              <Trash2 size={14} />
            )}
            <span>{isDeleting ? 'Deleting...' : isConfirming ? 'Confirm?' : 'Delete'}</span>
          </button>
        </div>
      </div>

      <div className="url-body">
        <div className="url-short-group">
          <span className="short-label">Short URL</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => onRedirect(url.shortCode, url._id, url.originalUrl)}
              disabled={isRedirecting}
              className="short-value"
              style={{
                background: 'none',
                border: 'none',
                cursor: isRedirecting ? 'wait' : 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                opacity: isRedirecting ? 0.6 : 1,
              }}
              title="Open shortened link"
            >
              {isRedirecting ? (
                <Loader2 size={14} className="loading-spinner" />
              ) : (
                <ExternalLink size={14} />
              )}
              {url.shortCode}
            </button>

            <button
              onClick={() => onCopy(`${API_BASE_URL}/${url.shortCode}`)}
              className="mini-copy-btn"
              title="Copy short URL"
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
  );
}