export function Footer() {
  return (
    <footer
      style={{
        padding: '4rem 1rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid var(--border)',
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        background: 'rgba(255, 255, 255, 0.01)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Project Brand */}
        <p style={{ 
          marginBottom: '1.5rem', 
          fontWeight: 'bold', 
          color: 'var(--text-main)', 
          fontSize: '1.1rem' 
        }}>
          ✂️ Short.ly
        </p>

        {/* Developer Credits */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          <div style={{ textAlign: 'left' }}>
            <span style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: '#863bff', fontWeight: 'bold' }}>Frontend</span>
            <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Sourabh Sharma</span>
          </div>

          <div style={{ height: '24px', width: '1px', background: 'var(--border)' }} />

          <div style={{ textAlign: 'left' }}>
            <span style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: '#22c55e', fontWeight: 'bold' }}>Backend</span>
            <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Rahul Vishwakarma</span>
          </div>
        </div>

        {/* Bottom Line */}
        <p style={{ opacity: 0.8 }}>
          © 2026 Modern URL Shortener. Built with React & Node.js
        </p>
      </div>
    </footer>
  );
}