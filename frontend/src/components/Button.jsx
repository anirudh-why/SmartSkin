import React from 'react';

function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  fullWidth = false, 
  disabled = false, 
  type = 'button', 
  className = '',
  size = 'medium'
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-all duration-300';
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };
  
  const variantClasses = {
    primary: 'text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary-400',
    secondary: 'text-white bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 shadow-md hover:shadow-lg focus:ring-2 focus:ring-secondary-400',
    outline: 'text-primary-700 bg-transparent border-2 border-primary-500 hover:bg-primary-50 focus:ring-2 focus:ring-offset-2 focus:ring-primary-400',
    'outline-secondary': 'text-secondary-700 bg-transparent border-2 border-secondary-500 hover:bg-secondary-50 focus:ring-2 focus:ring-offset-2 focus:ring-secondary-400',
    gradient: 'text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary-400',
    white: 'text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow border border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-primary-400',
    danger: 'text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg focus:ring-2 focus:ring-red-400',
  };

  const widthClasses = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'transform hover:-translate-y-0.5';

  return (
    <button
      type={type}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button; 