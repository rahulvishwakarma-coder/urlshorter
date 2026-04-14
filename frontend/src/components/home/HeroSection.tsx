import { motion } from 'framer-motion';
import type { User } from '../../types';
import { UrlShortenerForm } from './UrlShortenerForm';
import { FeaturesGrid } from './FeaturesGrid';

interface HeroSectionProps {
  user: User | null;
  onRequireAuth: () => void;
  onTokenUsed: () => void;
}

export function HeroSection({ user, onRequireAuth, onTokenUsed }: HeroSectionProps) {
  return (
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
          <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
            Welcome back, {user.fullName}!
          </p>
        ) : (
          <p className="hero-subtitle">
            Create short, memorable, and trackable links in seconds.
            The professional way to share your content.
          </p>
        )}

        <UrlShortenerForm
          user={user}
          onRequireAuth={onRequireAuth}
          onTokenUsed={onTokenUsed}
        />
      </section>

      <FeaturesGrid />
    </motion.div>
  );
}