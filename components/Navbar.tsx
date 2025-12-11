import React from 'react';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                E
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">Ekmyth</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activePage === 'home'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-gray-600 hover:text-brand-600 hover:bg-gray-50'
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => onNavigate('submit')}
              className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all hover:shadow-lg flex items-center gap-2"
            >
              <i className="fa-solid fa-plus"></i>
              <span>New Myth-Bust</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;