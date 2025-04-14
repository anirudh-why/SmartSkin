import React from 'react';

function Button({ children, onClick, variant = 'primary', fullWidth = false, disabled = false, type = 'button', className = '' }) {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'text-white bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500',
    outline: 'text-primary-700 bg-transparent border border-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    'outline-secondary': 'text-secondary-700 bg-transparent border border-secondary-600 hover:bg-secondary-50 focus:ring-secondary-500',
    white: 'text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary-500 border border-gray-300',
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
  };

  const widthClasses = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClasses} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button; 