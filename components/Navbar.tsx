import React from 'react';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  streak?: number;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate, streak = 0 }) => {
  return (
    <nav className="navbar" style={{ padding: '0.75rem 0' }}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => onNavigate('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <h1 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-truth-blue)', letterSpacing: '-0.03em' }}>Ekmyth</h1>
        </div>
        
        {/* Right Actions */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          
          {/* Streak Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="badge badge-pending">
            <i className="fas fa-fire" style={{ color: 'var(--color-curiosity-yellow)', fontSize: '1.2em' }}></i>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-ink-black)' }}>{streak}</span>
          </div>

          <button 
            onClick={() => onNavigate('home')}
            className={`btn ${activePage === 'home' ? 'btn-primary' : 'btn-secondary'}`}
            style={activePage === 'home' ? {} : { borderBottomWidth: '0' }} /* Subtle for inactive */
          >
            Feed
          </button>
          
          <button 
            onClick={() => onNavigate('submit')} 
            className="btn btn-primary"
            style={{ 
                backgroundColor: 'var(--color-myth-red)', 
                borderColor: 'var(--depth-red)',
                display: 'flex', 
                gap: '0.5rem' 
            }}
          >
            <i className="fas fa-plus"></i>
            <span className="hide-mobile">New Myth</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;