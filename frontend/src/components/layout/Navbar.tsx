import {
  Scissors,
  LogOut,
  Ticket,
  UserPlus,
  LogIn,
  LayoutDashboard,
  PlusCircle,
} from 'lucide-react';
import type { User } from '../../types';

interface NavbarProps {
  user: User | null;
  activeTab: 'home' | 'dashboard';
  onTabChange: (tab: 'home' | 'dashboard') => void;
  onShowAuth: () => void;
  onLogout: () => void;
}

export function Navbar({
  user,
  activeTab,
  onTabChange,
  onShowAuth,
  onLogout,
}: NavbarProps) {
  const tokensLeft = user ? user.tokenLimit - user.tokensUsed : 0;

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <div
          className="logo"
          onClick={() => onTabChange('home')}
          style={{ cursor: 'pointer' }}
        >
          <Scissors className="logo-icon" size={24} />
          <span>Short.ly</span>
        </div>

        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {user ? (
            <>
              <div style={{ display: 'flex', gap: '0.5rem', marginRight: '1rem' }}>
                <button
                  onClick={() => onTabChange('home')}
                  className={`nav-link-btn ${activeTab === 'home' ? 'active' : ''}`}
                >
                  <PlusCircle size={18} />
                  <span>Create</span>
                </button>
                <button
                  onClick={() => onTabChange('dashboard')}
                  className={`nav-link-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </button>
              </div>

              <div
                className="token-badge"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(134, 59, 255, 0.1)',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: '1px solid var(--primary-glow)',
                  fontSize: '0.9rem',
                }}
              >
                <Ticket size={16} color="var(--primary)" />
                <span style={{ fontWeight: 600 }}>{tokensLeft} Tokens</span>
              </div>

              <button
                onClick={onLogout}
                className="logout-btn"
                style={{
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={onShowAuth}
                className="nav-btn-text"
                style={{
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                <LogIn size={18} />
                <span>Login</span>
              </button>
              <button
                onClick={onShowAuth}
                className="submit-btn"
                style={{ marginTop: 0, padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
              >
                <UserPlus size={18} />
                <span>Get Started</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}