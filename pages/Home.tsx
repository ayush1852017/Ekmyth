import React, { useState } from 'react';
import { MythSubmission } from '../types';
import MythCard from '../components/MythCard';

interface HomeProps {
  myths: MythSubmission[];
  onMythClick: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ myths, onMythClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Science', 'History', 'Health', 'Tech', 'Culture'];

  const filteredMyths = myths.filter(myth => {
    const matchesSearch = myth.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          myth.mythClaim.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filter === 'All' || myth.category === filter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{minHeight: '100vh', background: 'var(--color-background)', paddingBottom: '4rem'}}>
      {/* Friendly Hero Section */}
      <div style={{ padding: '3rem 1rem', background: 'var(--color-background)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-ink-black)' }}>
          Let's <span style={{ color: 'var(--color-truth-blue)' }}>Verify</span> the World!
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
          Explore trending myths and discover the truth with AI-powered checks.
        </p>
        
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search for a myth..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{ 
                border: '2px solid var(--color-divider)', 
                boxShadow: 'none',
                height: '3.5rem',
                fontSize: '1rem',
                paddingLeft: '3rem'
            }}
          />
          <div className="search-icon" style={{ left: '1.25rem', color: 'var(--color-text-light)' }}>
            <i className="fas fa-search"></i>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="home-container">
        
        {/* Categories */}
        <div className="category-scroll" style={{ paddingBottom: '0.5rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`category-btn ${filter === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid-layout" style={{ marginTop: '1.5rem' }}>
          {filteredMyths.length > 0 ? (
            filteredMyths.map((myth) => (
              <MythCard key={myth.id} myth={myth} onClick={onMythClick} />
            ))
          ) : (
            <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-tertiary)'}}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>
                    <i className="fas fa-ghost"></i>
                </div>
              <h3 style={{fontSize: '1.25rem', marginBottom: '0.5rem'}}>No myths found</h3>
              <p>Be the first to verify this topic!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;