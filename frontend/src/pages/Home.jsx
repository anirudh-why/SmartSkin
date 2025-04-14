import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { SparklesIcon, BeakerIcon, CalendarIcon } from '@heroicons/react/24/outline';

function Home() {
  return (
    <div className="bg-gradient-to-b from-white via-primary-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20">
        {/* Decorative elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-24 right-0 w-72 h-72 bg-secondary-100 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute top-40 left-10 w-96 h-96 bg-primary-100 rounded-full filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-20">
            <div className="flex flex-col justify-center pt-8 px-4 sm:pt-12 sm:px-6 lg:px-8">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                  <span className="block text-gray-800 xl:inline">Your AI-Powered</span>{' '}
                  <span className="block bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent xl:inline">Skincare Assistant</span>
                </h1>
                <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  SmartSkin helps you discover the best skincare products for your unique needs and analyzes product ingredients to determine compatibility with your skin type.
                </p>
                <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:justify-center lg:justify-start sm:space-x-4 space-y-4 sm:space-y-0">
                  <Link to="/recommender">
                    <Button variant="primary" className="w-full sm:w-auto px-8 py-3 text-base font-medium shadow-lg shadow-primary-200 hover:shadow-primary-300 transform hover:-translate-y-1 transition-all duration-300">
                      Find Products
                    </Button>
                  </Link>
                  <Link to="/analyzer">
                    <Button variant="outline" className="w-full sm:w-auto px-8 py-3 text-base font-medium border-2 hover:bg-primary-50 transform hover:-translate-y-1 transition-all duration-300">
                      Analyze Ingredients
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* AI Image */}
            <div className="relative px-4 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full blur-3xl opacity-20 transform scale-95"></div>
              <div className="relative z-10 w-full max-w-md">
                <div className="relative drop-shadow-2xl">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30"></div>
                  <div className="relative bg-white p-2 rounded-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1609921205586-7e8a57516512?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                      alt="AI Skincare Analysis" 
                      className="w-full h-auto rounded-xl"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-full shadow-lg">
                      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 w-12 h-12 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-center space-x-2">
                  <span className="animate-pulse inline-block h-2 w-2 rounded-full bg-primary-500"></span>
                  <span className="animate-pulse inline-block h-2 w-2 rounded-full bg-primary-500" style={{ animationDelay: '0.2s' }}></span>
                  <span className="animate-pulse inline-block h-2 w-2 rounded-full bg-primary-500" style={{ animationDelay: '0.4s' }}></span>
                </div>
                <div className="text-center mt-2 text-sm text-gray-500">AI-powered analysis in progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold uppercase bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Better skincare decisions through AI
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Our intelligent algorithms help you find the best products for your unique skin type and concerns.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="relative p-6 bg-white rounded-xl shadow-lg border border-primary-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="absolute -top-6 left-6 bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-lg shadow-lg">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mt-2">Personalized Recommendations</h3>
                  <p className="mt-3 text-base text-gray-600">
                    Get personalized skincare product recommendations based on your skin type, concerns, and preferences. Our AI leverages a comprehensive product database to find your perfect match.
                  </p>
                  <Link to="/recommender" className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700">
                    Try the recommender
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative p-6 bg-white rounded-xl shadow-lg border border-secondary-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="absolute -top-6 left-6 bg-gradient-to-br from-secondary-500 to-secondary-600 p-3 rounded-lg shadow-lg">
                  <BeakerIcon className="h-6 w-6 text-white" />
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mt-2">Ingredient Analysis</h3>
                  <p className="mt-3 text-base text-gray-600">
                    Take a photo of product ingredients and our AI will analyze them to determine compatibility with your skin type. Save time and make informed choices with instant analysis.
                  </p>
                  <Link to="/analyzer" className="mt-4 inline-flex items-center text-sm font-medium text-secondary-600 hover:text-secondary-700">
                    Analyze ingredients
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Feature 3 - Daily Routine */}
              <div className="relative p-6 bg-white rounded-xl shadow-lg border border-purple-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="absolute -top-6 left-6 bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-lg shadow-lg">
                  <CalendarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mt-2">Daily Skincare Routine</h3>
                  <p className="mt-3 text-base text-gray-600">
                    Get a personalized daily skincare routine based on your skin type, concerns, and climate. Our AI builds a comprehensive morning and evening regimen tailored just for you.
                  </p>
                  <Link to="/routine" className="mt-4 inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700">
                    Create your routine
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 