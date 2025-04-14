import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';

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
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Skincare Product Recommender
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
          Find the perfect skincare products based on your unique needs and preferences.
        </p>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {!showResults ? (
        <div className="bg-white shadow rounded-lg p-6 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Skin Type */}
              <div>
                <label htmlFor="skin_type" className="block text-sm font-medium text-gray-700">
                  Skin Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="skin_type"
                  name="skin_type"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Categories (Optional)
                </label>
                <Select
                  isMulti
                  name="preferred_categories"
                  options={getSelectOptions(metadata.categories)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={selected => handleMultiSelectChange(selected, 'preferred_categories')}
                  placeholder="Select categories..."
                />
                <p className="mt-1 text-sm text-gray-500">Leave empty to see all categories</p>
              </div>
              
              {/* Skin Concerns */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skin Concerns (Optional)
                </label>
                <Select
                  isMulti
                  name="skin_concerns"
                  options={getSelectOptions(metadata.skin_concerns)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={selected => handleMultiSelectChange(selected, 'skin_concerns')}
                  placeholder="Select your skin concerns..."
                />
              </div>
              
              {/* Preferred Ingredients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Ingredients (Optional)
                </label>
                <Select
                  isMulti
                  name="preferred_ingredients"
                  options={getSelectOptions(metadata.common_ingredients)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={selected => handleMultiSelectChange(selected, 'preferred_ingredients')}
                  placeholder="Select ingredients you prefer..."
                />
              </div>
              
              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies (Optional)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="allergies"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter allergies separated by commas (e.g., Fragrance, Alcohol)"
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value.split(',').map(item => item.trim()).filter(Boolean) })}
                  />
                </div>
              </div>
              
              <div className="pt-3">
                <Button type="submit" fullWidth disabled={loading}>
                  {loading ? 'Finding Products...' : 'Get Recommendations'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Recommended Products for {formData.skin_type} Skin
            </h2>
            <Button variant="outline" onClick={resetForm}>
              New Search
            </Button>
          </div>
          
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recommendations.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No products match your criteria. Try adjusting your preferences.</p>
              <Button variant="primary" className="mt-4" onClick={resetForm}>
                Try Again
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RecommenderPage; 