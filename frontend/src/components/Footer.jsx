import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-primary-50 to-secondary-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex justify-center md:justify-start mb-4 md:mb-0">
            <span className="font-heading text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              Smart<span className="font-extrabold">Skin</span>
            </span>
          </div>
          
          <div className="flex justify-center space-x-6">
            <Link to="/" className="text-gray-500 hover:text-primary-600 transition-colors duration-200">
              Home
            </Link>
            <Link to="/about" className="text-gray-500 hover:text-primary-600 transition-colors duration-200">
              About
            </Link>
            <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors duration-200">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors duration-200">
              Terms
            </a>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SmartSkin - AI-Powered Skincare Assistant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 