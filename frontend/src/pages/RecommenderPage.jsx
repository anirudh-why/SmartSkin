import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import { BeakerIcon } from '@heroicons/react/24/outline';

function RecommenderPage() {
  const [metadata, setMetadata] = useState({
    skin_types: [],
    categories: [],
    skin_concerns: [],
    common_ingredients: []
  });
  
  const [formData, setFormData] = useState({
    skin_type: '',
    skin_concerns: [],
    preferred_ingredients: [],
    allergies: [],
    preferred_categories: []
  });
  
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  
  // Fetch metadata for form options
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await axios.get('/api/recommender/metadata');
        setMetadata(response.data);
        
        // Set default skin type
        if (response.data.skin_types.length > 0) {
          setFormData(prev => ({
            ...prev,
            skin_type: response.data.skin_types[0]
          }));
        }
      } catch (err) {
        setError('Failed to load form data. Please try again later.');
        console.error('Error fetching metadata:', err);
      }
    };
    
    fetchMetadata();
  }, []);
  
  const handleSkinTypeChange = (e) => {
    setFormData({
      ...formData,
      skin_type: e.target.value
    });
  };
  
  const handleMultiSelectChange = (selected, field) => {
    setFormData({
      ...formData,
      [field]: selected ? selected.map(item => item.value) : []
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/recommender/recommendations', formData);
      setRecommendations(response.data.recommendations);
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Failed to get recommendations. Please try again.');
      console.error('Error getting recommendations:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Convert arrays to options format for react-select
  const getSelectOptions = (items) => {
    return items.map(item => ({ value: item, label: item }));
  };
  
  // Custom styles for react-select
  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderColor: '#e5e7eb',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#a78bfa',
      },
      borderRadius: '0.375rem',
      padding: '2px',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#8b5cf6' : state.isFocused ? '#ede9fe' : 'white',
      color: state.isSelected ? 'white' : '#374151',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#ede9fe',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#6d28d9',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#6d28d9',
      '&:hover': {
        backgroundColor: '#ddd6fe',
        color: '#4c1d95',
      },
    }),
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Skincare Product Recommender
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600">
          Find the perfect skincare products based on your unique needs.
        </p>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}
      
      {!showResults ? (
        <div className="bg-white shadow rounded-lg border border-gray-100 overflow-hidden max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Skin Type */}
              <div className="p-4">
                <label htmlFor="skin_type" className="block text-md font-medium text-gray-900">
                  Skin Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="skin_type"
                  name="skin_type"
                  className="block w-full mt-1 border-gray-300 focus:ring-primary-500 focus:border-primary-500 rounded-md"
                  style={{ minWidth: '250px' }}
                  value={formData.skin_type}
                  onChange={handleSkinTypeChange}
                  required
                >
                  <option value="">Select your skin type</option>
                  {metadata.skin_types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              {/* Categories */}
              <div className="p-4">
                <label className="block text-md font-medium text-gray-900">
                  Product Categories
                </label>
                <Select
                  isMulti
                  name="preferred_categories"
                  options={getSelectOptions(metadata.categories)}
                  styles={customSelectStyles}
                  className="basic-multi-select mt-1"
                  classNamePrefix="select"
                  onChange={selected => handleMultiSelectChange(selected, 'preferred_categories')}
                  placeholder="Select categories..."
                />
              </div>
              
              {/* Skin Concerns and Preferred Ingredients */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4">
                  <label className="block text-md font-medium text-gray-900">
                    Skin Concerns
                  </label>
                  <Select
                    isMulti
                    name="skin_concerns"
                    options={getSelectOptions(metadata.skin_concerns)}
                    styles={customSelectStyles}
                    className="basic-multi-select mt-1"
                    classNamePrefix="select"
                    onChange={selected => handleMultiSelectChange(selected, 'skin_concerns')}
                    placeholder="Select your skin concerns..."
                  />
                </div>
                <div className="p-4">
                  <label className="block text-md font-medium text-gray-900">
                    Preferred Ingredients
                  </label>
                  <Select
                    isMulti
                    name="preferred_ingredients"
                    options={getSelectOptions(metadata.common_ingredients)}
                    styles={customSelectStyles}
                    className="basic-multi-select mt-1"
                    classNamePrefix="select"
                    onChange={selected => handleMultiSelectChange(selected, 'preferred_ingredients')}
                    placeholder="Select ingredients you prefer..."
                  />
                </div>
              </div>
              
              {/* Allergies */}
              <div className="p-4">
                <label className="block text-md font-medium text-gray-900">
                  Allergies or Sensitivities
                </label>
                <input
                  type="text"
                  name="allergies"
                  className="mt-1 block w-full border-gray-300 rounded-md"
                  style={{ minWidth: '250px' }}
                  placeholder="Enter allergies separated by commas"
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value.split(',').map(item => item.trim()).filter(Boolean) })}
                />
              </div>
              
              <div className="pt-3">
                <Button 
                  type="submit" 
                  variant="primary" 
                  fullWidth 
                  disabled={loading}
                  className="py-3 text-lg"
                >
                  {loading ? 'Finding Your Perfect Products...' : 'Get Recommendations'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div className="bg-white shadow-lg rounded-xl p-4 mb-8 flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                Recommended Products for {formData.skin_type} Skin
              </h2>
              <p className="text-gray-600 mt-1">Tailored recommendations based on your preferences</p>
            </div>
            <Button 
              variant="outline" 
              onClick={resetForm}
              className="mt-4 md:mt-0"
            >
              Start New Search
            </Button>
          </div>
          
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recommendations.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No products match your criteria</h3>
              <p className="mt-2 text-base text-gray-500">Try adjusting your preferences to see more products.</p>
              <Button variant="primary" className="mt-6" onClick={resetForm}>
                Try Different Preferences
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RecommenderPage; 