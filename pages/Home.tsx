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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-brand-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <i className="fa-solid fa-magnifying-glass text-[400px]"></i>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Truth Matters. <span className="text-brand-400">Especially Now.</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            Ekmyth is an AI-powered community platform dedicated to verifying facts and busting myths. Safe, sourced, and transparent.
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for a myth (e.g., 'Carrots give you night vision')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-brand-500/50 shadow-xl text-lg pl-14"
            />
            <i className="fa-solid fa-search absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        
        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-6 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-all ${
                filter === cat 
                  ? 'bg-brand-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {filteredMyths.length > 0 ? (
            filteredMyths.map((myth) => (
              <MythCard key={myth.id} myth={myth} onClick={onMythClick} />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="text-gray-300 text-6xl mb-4">
                <i className="fa-solid fa-wind"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-900">No myths found</h3>
              <p className="text-gray-500">Try searching for something else or submit a new one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;