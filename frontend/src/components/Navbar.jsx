import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ];

  // Only show these links to authenticated users
  const authNavLinks = [
    { name: 'Recommender', path: '/recommender' },
    { name: 'Analyzer', path: '/analyzer' },
    { name: 'Routine', path: '/routine' },
  ];

  // Get all relevant navigation links
  const activeNavLinks = [...navLinks, ...(isAuthenticated ? authNavLinks : [])];

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-r from-primary-50 to-secondary-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="font-heading text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                Smart<span className="font-extrabold">Skin</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation - now right aligned */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {activeNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`${
                  isActive(link.path)
                    ? 'border-b-2 border-primary-500 text-primary-700 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-primary-600 hover:border-b-2 hover:border-primary-300'
                } inline-flex items-center px-3 py-1 text-sm font-medium transition-all duration-200 h-16`}
              >
                {link.name}
              </Link>
            ))}

            {/* Authentication buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className={`${
                    isActive('/dashboard')
                      ? 'border-b-2 border-primary-500 text-primary-700 font-semibold'
                      : 'border-transparent text-gray-600 hover:text-primary-600 hover:border-b-2 hover:border-primary-300'
                  } inline-flex items-center px-3 py-1 text-sm font-medium transition-all duration-200 h-16`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-gray-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-gray-300"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-primary-600 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden absolute w-full bg-white shadow-lg border-t border-gray-100">
          <div className="pt-2 pb-3 space-y-1">
            {activeNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-primary-50 to-secondary-50 border-l-4 border-primary-500 text-primary-700 font-medium'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-l-4 hover:border-primary-300 hover:text-primary-600'
                } block pl-3 pr-4 py-2 text-base transition-all duration-200`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Authentication mobile links */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`${
                    isActive('/dashboard')
                      ? 'bg-gradient-to-r from-primary-50 to-secondary-50 border-l-4 border-primary-500 text-primary-700 font-medium'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-l-4 hover:border-primary-300 hover:text-primary-600'
                  } block pl-3 pr-4 py-2 text-base transition-all duration-200`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left border-transparent text-gray-500 hover:bg-gray-50 hover:border-l-4 hover:border-primary-300 hover:text-primary-600 block pl-3 pr-4 py-2 text-base transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-l-4 hover:border-primary-300 hover:text-primary-600 block pl-3 pr-4 py-2 text-base transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="border-transparent bg-primary-50 text-primary-700 hover:bg-primary-100 hover:border-l-4 hover:border-primary-500 block pl-3 pr-4 py-2 text-base font-medium transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar; 