import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoClick = () => {
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-darker border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={handleLogoClick}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-white">NovelTap</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/my-status')}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Check Status
            </button>
            <button
              onClick={() => navigate('/membership')}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Membership
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Admin
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white p-2 rounded-md"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-darker border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => { navigate('/'); closeMenu(); }}
                className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Home
              </button>
              <button
                onClick={() => { navigate('/my-status'); closeMenu(); }}
                className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Check Status
              </button>
              <button
                onClick={() => { navigate('/membership'); closeMenu(); }}
                className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Membership
              </button>
              <button
                onClick={() => { navigate('/admin'); closeMenu(); }}
                className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
