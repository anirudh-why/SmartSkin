import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import ProductFeedback from './ProductFeedback';
import { useAuth } from '../contexts/AuthContext';

function ProductCard({ product }) {
  const [showIngredients, setShowIngredients] = useState(false);
  const { isAuthenticated } = useAuth();

  // Generate a random pastel color for brand badges
  const generatePastelColor = (seed) => {
    const hue = (seed * 137.5) % 360;
    return `hsl(${hue}, 70%, 90%)`;
  };

  const brandColor = generatePastelColor(product.brand.charCodeAt(0));
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span 
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
            style={{ backgroundColor: brandColor, color: 'rgba(0,0,0,0.7)' }}
          >
            {product.brand}
          </span>
          <div className="flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <span className="ml-1 text-sm font-medium text-gray-700">{product.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.label}</p>
        
        <div className="flex justify-between items-center mb-3">
          {/* <div className="text-sm font-medium text-gray-900">
            {product.price > 0 ? `$${product.price}` : 'Price N/A'}
          </div> */}
          {/* <div className="text-sm text-primary-600">
            Match Score: {Math.round(product.score)}
          </div> */}
        </div>
        
        <button
          onClick={() => setShowIngredients(!showIngredients)}
          className="text-sm text-secondary-600 hover:text-secondary-700 font-medium"
        >
          {showIngredients ? 'Hide Ingredients' : 'Show Ingredients'}
        </button>
        
        {showIngredients && (
          <div className="mt-2 p-2 bg-gray-50 rounded-md text-xs text-gray-600 max-h-32 overflow-y-auto">
            {product.ingredients}
          </div>
        )}
        
        {isAuthenticated && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <ProductFeedback product={product} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard; 