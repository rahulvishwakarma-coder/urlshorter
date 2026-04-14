import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Clock } from 'lucide-react';
import { useUrls } from '../../hooks/useUrl';
import { UrlCard } from './UrlCard';

interface DashboardProps {
  onNavigateHome: () => void;
  onCopy: (text: string) => void;
}

export function Dashboard({ onNavigateHome, onCopy }: DashboardProps) {
  const {
    userUrls,
    isHistoryLoading,
    deletingId,
    deleteConfirmId,
    redirectingId,
    fetchUserUrls,
    handleRedirect,
    handleDeleteUrl,
  } = useUrls();

  useEffect(() => {
    fetchUserUrls();
  }, []);

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="dashboard-container"
      style={{ paddingTop: '2rem' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Your Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage and track your shortened links</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
            {userUrls.length}
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Total Links
          </div>
        </div>
      </div>

      {isHistoryLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 className="loading-spinner" size={40} color="var(--primary)" />
        </div>
      ) : userUrls.length === 0 ? (
        <div className="tool-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Clock
            size={48}
            style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', opacity: 0.5 }}
          />
          <h3>No links yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            You haven't shortened any links yet. Start creating now!
          </p>
          <button
            onClick={onNavigateHome}
            className="submit-btn"
            style={{ maxWidth: '200px', margin: '0 auto' }}
          >
            Create First Link
          </button>
        </div>
      ) : (
        <div className="links-grid">
          <AnimatePresence>
            {userUrls.map((url) => (
              <UrlCard
                key={url._id}
                url={url}
                isDeleting={deletingId === url._id}
                isConfirming={deleteConfirmId === url._id}
                isRedirecting={redirectingId === url._id}
                onDelete={handleDeleteUrl}
                onRedirect={handleRedirect}
                onCopy={onCopy}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}