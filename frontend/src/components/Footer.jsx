import React from 'react';

function Footer() {
  return (
    <footer className="bg-white mt-12">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SmartSkin - AI-Powered Skincare Assistant
          </p>
        </div>
        <div className="flex justify-center space-x-6 md:order-2">
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Privacy Policy</span>
            <span className="text-sm text-gray-500 hover:text-primary-500">Privacy</span>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Terms of Service</span>
            <span className="text-sm text-gray-500 hover:text-primary-500">Terms</span>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Contact Us</span>
            <span className="text-sm text-gray-500 hover:text-primary-500">Contact</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 