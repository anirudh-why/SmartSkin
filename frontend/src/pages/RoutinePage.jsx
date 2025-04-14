import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BeakerIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { CloudIcon, FireIcon } from '@heroicons/react/24/solid';
import Select from 'react-select';
import Button from '../components/Button';

function RoutinePage() {
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [routine, setRoutine] = useState(null);
  const [error, setError] = useState(null);
  const [ageRange, setAgeRange] = useState('18-30');
  
  // Form state for user input
  const [formData, setFormData] = useState({
    skin_type: '',
    skin_concerns: [],
    allergies: [],
    climate: 'mild',
    age: 25,
    include_products: true
  });
  
  // Define age ranges
  const ageRanges = [
    { value: 'under-18', label: 'Under 18', age: 16 },
    { value: '18-30', label: '18-30', age: 25 },
    { value: '31-45', label: '31-45', age: 38 },
    { value: '46-60', label: '46-60', age: 53 },
    { value: 'over-60', label: 'Over 60', age: 65 }
  ];
  
  // Load metadata on component mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await axios.get('/api/routine/metadata');
        setMetadata(response.data);
      } catch (err) {
        console.error('Error fetching metadata:', err);
        setError('Could not load form data. Please try again later.');
      }
    };
    
    fetchMetadata();
  }, []);
  
  const handleSkinTypeChange = (e) => {
    setFormData({ ...formData, skin_type: e.target.value });
  };
  
  const handleConcernsChange = (selected) => {
    setFormData({ 
      ...formData, 
      skin_concerns: selected ? selected.map(option => option.value) : [] 
    });
  };
  
  const handleAllergiesChange = (e) => {
    // Split by commas and trim whitespace
    const allergies = e.target.value.split(',').map(item => item.trim()).filter(item => item);
    setFormData({ ...formData, allergies });
  };
  
  const handleClimateChange = (e) => {
    setFormData({ ...formData, climate: e.target.value });
  };
  
  const handleAgeRangeChange = (selected) => {
    if (selected) {
      setAgeRange(selected.value);
      setFormData({ ...formData, age: selected.age });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/routine/recommendations', formData);
      if (response.data.success) {
        setRoutine(response.data.routine);
        window.scrollTo({ top: document.getElementById('results').offsetTop - 80, behavior: 'smooth' });
      } else {
        setError(response.data.error || 'An error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching routine:', err);
      setError('Could not generate routine. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const getClimateIcon = (climate) => {
    switch (climate) {
      case 'hot_humid':
        return <FireIcon className="h-6 w-6 text-orange-500" />;
      case 'cold_dry':
        return <CloudIcon className="h-6 w-6 text-blue-500" />;
      case 'mild':
      default:
        return <CloudIcon className="h-6 w-6 text-green-500" />;
    }
  };
  
  if (!metadata) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-xl text-gray-600">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Your Personalized Skincare Routine
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get a customized daily skincare routine based on your skin type, concerns, and other factors.
          Our AI recommends the most effective products and ingredients for your unique needs.
        </p>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tell us about your skin</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Skin Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Skin Type</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {metadata.skin_types.map((type) => (
                <label key={type} className={`
                  flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition duration-200
                  ${formData.skin_type === type 
                    ? 'border-primary-500 bg-primary-50 text-primary-700' 
                    : 'border-gray-200 hover:border-primary-200 hover:bg-primary-50/50'
                  }
                `}>
                  <input
                    type="radio"
                    name="skin_type"
                    value={type}
                    checked={formData.skin_type === type}
                    onChange={handleSkinTypeChange}
                    className="sr-only"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Skin Concerns */}
          <div>
            <label htmlFor="skin_concerns" className="block text-gray-700 font-medium mb-2">
              What are your skin concerns? (Select all that apply)
            </label>
            <Select
              isMulti
              name="skin_concerns"
              options={metadata.skin_concerns.map(concern => ({ value: concern, label: concern }))}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select skin concerns..."
              onChange={handleConcernsChange}
            />
          </div>
          
          {/* Age Range */}
          <div>
            <label htmlFor="age_range" className="block text-gray-700 font-medium mb-2">
              What is your age range?
            </label>
            <Select
              name="age_range"
              options={ageRanges}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select age range..."
              onChange={handleAgeRangeChange}
              defaultValue={ageRanges.find(range => range.value === ageRange)}
            />
          </div>
          
          {/* Allergies */}
          <div>
            <label htmlFor="allergies" className="block text-gray-700 font-medium mb-2">
              Any ingredients you're allergic to? (comma-separated)
            </label>
            <input
              type="text"
              id="allergies"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Fragrance, Alcohol, Sulfates"
              onChange={handleAllergiesChange}
            />
          </div>
          
          {/* Climate */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              What's your climate?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {metadata.climate_options.map((climate) => (
                <label key={climate} className={`
                  flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition duration-200
                  ${formData.climate === climate 
                    ? 'border-primary-500 bg-primary-50 text-primary-700' 
                    : 'border-gray-200 hover:border-primary-200 hover:bg-primary-50/50'
                  }
                `}>
                  <input
                    type="radio"
                    name="climate"
                    value={climate}
                    checked={formData.climate === climate}
                    onChange={handleClimateChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    {getClimateIcon(climate)}
                    <span className="ml-2">
                      {climate.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="text-center pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !formData.skin_type}
              className="w-full max-w-md py-3 text-lg shadow-lg shadow-primary-200 hover:shadow-primary-300 transform hover:-translate-y-1 transition-all duration-300"
            >
              {loading ? 'Generating your routine...' : 'Get Your Personalized Routine'}
            </Button>
          </div>
        </form>
      </div>
      
      {/* Results Section */}
      <div id="results" className={`${routine ? 'block' : 'hidden'}`}>
        {routine && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
              Your Personalized Skincare Routine
            </h2>
            
            {/* Morning Routine */}
            <div className="mb-10">
              <div className="flex items-center space-x-2 mb-4">
                <SunIcon className="h-7 w-7 text-amber-500" />
                <h3 className="text-xl font-semibold text-gray-800">Morning Routine</h3>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-6">
                <ol className="space-y-8">
                  {routine.morning.map((item, index) => (
                    <li key={`morning-${index}`} className="relative pl-8">
                      <div className="absolute left-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow">
                        <h4 className="font-semibold text-gray-800">{item.step}</h4>
                        {item.texture && (
                          <p className="text-sm text-amber-600 mb-2">Recommended Texture: {item.texture}</p>
                        )}
                        <div className="mt-2">
                          <h5 className="text-sm font-medium text-gray-700">Recommended Ingredients:</h5>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.recommended_ingredients.map((ingredient, i) => (
                              <span key={i} className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {item.avoid_ingredients && item.avoid_ingredients.length > 0 && (
                          <div className="mt-2">
                            <h5 className="text-sm font-medium text-gray-700">Avoid Ingredients:</h5>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.avoid_ingredients.map((ingredient, i) => (
                                <span key={i} className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                                  {ingredient}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.product_recommendations && (
                          <div className="mt-4">
                            <h5 className="text-sm font-medium text-gray-700">Product Recommendations:</h5>
                            <ul className="mt-2 space-y-2">
                              {item.product_recommendations.map((product, i) => (
                                <li key={i} className="p-2 bg-gray-50 rounded text-sm">
                                  <div className="font-medium">{product.brand} - {product.name}</div>
                                  <div className="text-xs text-gray-500">Rating: {product.rating}/5</div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            
            {/* Evening Routine */}
            <div className="mb-10">
              <div className="flex items-center space-x-2 mb-4">
                <MoonIcon className="h-7 w-7 text-indigo-500" />
                <h3 className="text-xl font-semibold text-gray-800">Evening Routine</h3>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-6">
                <ol className="space-y-8">
                  {routine.evening.map((item, index) => (
                    <li key={`evening-${index}`} className="relative pl-8">
                      <div className="absolute left-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow">
                        <h4 className="font-semibold text-gray-800">{item.step}</h4>
                        {item.texture && (
                          <p className="text-sm text-indigo-600 mb-2">Recommended Texture: {item.texture}</p>
                        )}
                        <div className="mt-2">
                          <h5 className="text-sm font-medium text-gray-700">Recommended Ingredients:</h5>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.recommended_ingredients.map((ingredient, i) => (
                              <span key={i} className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {item.avoid_ingredients && item.avoid_ingredients.length > 0 && (
                          <div className="mt-2">
                            <h5 className="text-sm font-medium text-gray-700">Avoid Ingredients:</h5>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.avoid_ingredients.map((ingredient, i) => (
                                <span key={i} className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                                  {ingredient}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {item.product_recommendations && (
                          <div className="mt-4">
                            <h5 className="text-sm font-medium text-gray-700">Product Recommendations:</h5>
                            <ul className="mt-2 space-y-2">
                              {item.product_recommendations.map((product, i) => (
                                <li key={i} className="p-2 bg-gray-50 rounded text-sm">
                                  <div className="font-medium">{product.brand} - {product.name}</div>
                                  <div className="text-xs text-gray-500">Rating: {product.rating}/5</div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            
            {/* Weekly Treatments */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BeakerIcon className="h-7 w-7 text-purple-500" />
                <h3 className="text-xl font-semibold text-gray-800">Weekly Treatments</h3>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {routine.weekly.map((item, index) => (
                    <div key={`weekly-${index}`} className="bg-white rounded-lg p-4 shadow">
                      <h4 className="font-semibold text-gray-800">{item.step}</h4>
                      <p className="text-sm text-purple-600 mb-2">Frequency: {item.frequency}</p>
                      <div className="mt-2">
                        <h5 className="text-sm font-medium text-gray-700">Recommended Ingredients:</h5>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.recommended_ingredients.map((ingredient, i) => (
                            <span key={i} className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoutinePage; 