import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { CameraIcon, DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Webcam from 'react-webcam';
import Button from '../components/Button';

function AnalyzerPage() {
  const [ingredients, setIngredients] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('text'); // 'text', 'upload', or 'camera'

  const webcamRef = useRef(null);
  
  // Handle file drops
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Only accept image files
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file.');
        return;
      }
      
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1
  });
  
  // Handle text input change
  const handleIngredientsChange = (e) => {
    setIngredients(e.target.value);
  };
  
  // Analyze ingredients text
  const analyzeIngredientsText = async () => {
    if (!ingredients.trim()) {
      setError('Please enter ingredients text to analyze.');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/analyzer/ingredients', {
        ingredients: ingredients
      });
      
      if (response.data.success === false) {
        setError(response.data.error || 'Failed to analyze ingredients. Please try again.');
        return;
      }
      
      setAnalysisResults(response.data);
    } catch (err) {
      console.error('Error analyzing ingredients:', err);
      setError(err.response?.data?.error || 'Failed to analyze ingredients. Please try again. Make sure the server is running and the models are properly loaded.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Analyze image
  const analyzeImage = async (imageData) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/analyzer/analyze', {
        image: imageData
      });
      
      if (response.data.success) {
        setIngredients(response.data.ingredients);
        setAnalysisResults(response.data);
      } else {
        setError(response.data.error || 'Failed to extract text from image.');
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError(err.response?.data?.error || 'Failed to analyze image. Please make sure the server is running and models are properly loaded.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Handle file upload analysis
  const handleFileAnalysis = async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      analyzeImage(reader.result);
    };
    reader.readAsDataURL(imageFile);
  };
  
  // Handle webcam capture
  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImagePreviewUrl(imageSrc);
        analyzeImage(imageSrc);
      } else {
        setError('Failed to capture image. Please try again.');
      }
    }
  };
  
  // Switch between analysis modes
  const switchMode = (newMode) => {
    setMode(newMode);
    setAnalysisResults(null);
    setError(null);
    setIngredients('');
    setImageFile(null);
    setImagePreviewUrl('');
  };
  
  // Render analysis results
  const renderAnalysisResults = () => {
    if (!analysisResults) return null;
    
    const { suitability_scores, best_for, best_score } = analysisResults;
    
    if (!suitability_scores) {
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
          <p className="text-yellow-700">
            {analysisResults.warning || 'Could not determine skin type suitability.'}
          </p>
        </div>
      );
    }
    
    return (
      <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-primary-600 to-secondary-500">
          <h3 className="text-lg leading-6 font-medium text-white">
            Analysis Results
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Best suited for</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-bold">
                {best_for} Skin ({(best_score * 100).toFixed(1)}% match)
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 mb-2">Compatibility by Skin Type</dt>
              <dd className="mt-1 sm:mt-0">
                {Object.entries(suitability_scores).map(([type, score]) => (
                  <div key={type} className="mb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{type}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {(score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${type === best_for ? 'bg-primary-600' : 'bg-gray-500'}`}
                        style={{ width: `${score * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Skincare Ingredient Analyzer
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
          Analyze product ingredients to determine compatibility with different skin types.
        </p>
      </div>
      
      {/* Mode selector */}
      <div className="mb-6">
        <div className="flex flex-wrap justify-center space-x-2 sm:space-x-4">
          <button
            onClick={() => switchMode('text')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              mode === 'text'
                ? 'bg-primary-100 text-primary-700 border-2 border-primary-700'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <DocumentTextIcon className="h-5 w-5 mr-1" />
            Enter Text
          </button>
          <button
            onClick={() => switchMode('upload')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              mode === 'upload'
                ? 'bg-primary-100 text-primary-700 border-2 border-primary-700'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <PhotoIcon className="h-5 w-5 mr-1" />
            Upload Image
          </button>
          <button
            onClick={() => switchMode('camera')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              mode === 'camera'
                ? 'bg-primary-100 text-primary-700 border-2 border-primary-700'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <CameraIcon className="h-5 w-5 mr-1" />
            Use Camera
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg p-6">
        {/* Text Input Mode */}
        {mode === 'text' && (
          <div>
            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
              Enter product ingredients
            </label>
            <textarea
              id="ingredients"
              rows={6}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="Paste the ingredients list here..."
              value={ingredients}
              onChange={handleIngredientsChange}
            />
            <div className="mt-4">
              <Button
                onClick={analyzeIngredientsText}
                disabled={isAnalyzing || !ingredients.trim()}
                fullWidth
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Ingredients'}
              </Button>
            </div>
          </div>
        )}
        
        {/* Image Upload Mode */}
        {mode === 'upload' && (
          <div>
            <div
              {...getRootProps()}
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary-500"
            >
              <div className="space-y-1 text-center">
                <input {...getInputProps()} />
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <p className="pl-1">Drag and drop an image here, or click to select a file</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            
            {imagePreviewUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <img src={imagePreviewUrl} alt="Preview" className="max-h-64 mx-auto" />
              </div>
            )}
            
            <div className="mt-4">
              <Button
                onClick={handleFileAnalysis}
                disabled={isAnalyzing || !imageFile}
                fullWidth
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
              </Button>
            </div>
          </div>
        )}
        
        {/* Camera Mode */}
        {mode === 'camera' && (
          <div>
            {!imagePreviewUrl ? (
              <>
                <div className="webcam-container flex justify-center">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: 'environment' }}
                    className="rounded-md"
                  />
                </div>
                <div className="mt-4">
                  <Button
                    onClick={captureImage}
                    disabled={isAnalyzing}
                    fullWidth
                  >
                    Capture & Analyze
                  </Button>
                </div>
              </>
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Captured Image:</p>
                <img src={imagePreviewUrl} alt="Captured" className="max-h-64 mx-auto rounded-md" />
                <div className="mt-4 flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setImagePreviewUrl('');
                      setAnalysisResults(null);
                    }}
                    fullWidth
                  >
                    Take Another
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Extract Text Results */}
        {ingredients && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Extracted Ingredients:</h3>
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">{ingredients}</p>
            </div>
          </div>
        )}
        
        {/* Analysis Results */}
        {renderAnalysisResults()}
      </div>
    </div>
  );
}

export default AnalyzerPage; 