import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        
        {/* Top Section: Brand & Credits */}
        <div style={gridStyle}>
          
          {/* Column 1: Project Info */}
          <div style={columnStyle}>
            <h3 style={logoStyle}>✂️ Short.ly</h3>
            <p style={descriptionStyle}>
              A professional URL shortener for modern developers. 
              Making links shorter and tracking easier.
            </p>
          </div>

          {/* Column 2: The Team */}
          <div style={columnStyle}>
            <h4 style={headingStyle}>The Developers</h4>
            <div style={devEntryStyle}>
              <span style={roleLabelStyle}>Frontend</span>
              <span style={nameStyle}>Sourabh Sharma</span>
            </div>
            <div style={devEntryStyle}>
              <span style={roleLabelStyle}>Backend</span>
              <span style={nameStyle}>Rahul Vishwakarma</span>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div style={columnStyle}>
            <h4 style={headingStyle}>Connect</h4>
            <div style={linkGroupStyle}>
              <a href="#" style={linkStyle}>GitHub</a>
              <a href="#" style={linkStyle}>LinkedIn</a>
              <a href="#" style={linkStyle}>Contact</a>
            </div>
          </div>

        </div>

        {/* Bottom Section: Copyright */}
        <div style={bottomBarStyle}>
          <p>© {currentYear} Short.ly • LimitLess</p>
        </div>

      </div>
    </footer>
  );
};

// --- CSS-in-JS Styles (No External CSS Needed) ---

const footerStyle: React.CSSProperties = {
  marginTop: '5rem',
  padding: '4rem 1rem 2rem 1rem',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  background: 'rgba(255, 255, 255, 0.02)',
  backdropFilter: 'blur(10px)',
  color: '#94a3b8',
  fontFamily: 'Inter, system-ui, sans-serif',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '1000px',
  margin: '0 auto',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '2.5rem',
  marginBottom: '3rem',
};

const columnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const logoStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: '800',
  color: '#f8fafc',
  margin: 0,
};

const descriptionStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  lineHeight: '1.6',
  maxWidth: '300px',
};

const headingStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#6366f1', // Indigo accent
  margin: '0 0 0.5rem 0',
};

const devEntryStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '0.5rem',
};

const roleLabelStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: '600',
  color: '#64748b',
  textTransform: 'uppercase',
};

const nameStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: '500',
  color: '#f1f5f9',
};

const linkGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const linkStyle: React.CSSProperties = {
  color: '#94a3b8',
  textDecoration: 'none',
  fontSize: '0.9rem',
  transition: 'color 0.2s',
};

const bottomBarStyle: React.CSSProperties = {
  paddingTop: '2rem',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  textAlign: 'center',
  fontSize: '0.85rem',
};

export default Footer;