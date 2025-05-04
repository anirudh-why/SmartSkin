import React from 'react';

function AboutPage() {
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-primary-50 via-secondary-50/30 to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500">
          About SmartSkin
            </span>
        </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            An AI-powered assistant for better, personalized skincare decisions
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Mission section */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary-500 to-secondary-400"></div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                SmartSkin is designed to democratize access to personalized skincare advice. We believe everyone deserves 
                to make informed decisions about the products they use, regardless of their skincare knowledge.
              </p>
              <p className="text-gray-600">
                Using artificial intelligence and machine learning, we analyze products, ingredients, and user experiences
                to provide recommendations tailored to your unique skin needs.
              </p>
            </div>
          </div>
          
          {/* Features section */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-secondary-400 to-primary-500"></div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Features</h2>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-primary-600 mb-2">Personalized Product Recommendations</h3>
                <p className="text-gray-600">
                  Our recommendation engine analyzes your skin type, concerns, and preferences to suggest products 
                  that are most likely to work well for you, considering factors such as ingredient compatibility and user ratings.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-primary-600 mb-2">Ingredient Analysis</h3>
                <p className="text-gray-600">
                  Our image recognition technology can extract ingredient lists from product packaging, and our AI algorithm analyzes 
                  these ingredients to determine their suitability for different skin types.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* How it works section */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-16">
          <div className="h-2 bg-gradient-to-r from-primary-400 via-secondary-500 to-primary-500"></div>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center p-6 rounded-lg bg-primary-50">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Collection</h3>
                <p className="text-gray-600">
                  We collect information about your skin type, concerns, and preferences through our assessment tool.
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-secondary-50">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary-100 text-secondary-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis</h3>
                <p className="text-gray-600">
                  Our machine learning models analyze this data along with our extensive database of skincare products and ingredients.
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-primary-50">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Results</h3>
                <p className="text-gray-600">
                  We provide you with personalized product recommendations and ingredient analyses based on your specific needs.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Disclaimer section */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy & Disclaimer</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-primary-600 mb-2">Privacy & Data Usage</h3>
                <p className="text-gray-600">
            We take your privacy seriously. Images uploaded for ingredient analysis are processed on our secure servers and are not stored permanently.
            Your preferences and skin information are only used to provide you with better recommendations and are never shared with third parties.
          </p>
              </div>
          
              <div>
                <h3 className="text-lg font-semibold text-primary-600 mb-2">Disclaimer</h3>
                <p className="text-gray-600">
            SmartSkin is designed to provide information and suggestions, not medical advice. Always consult with a dermatologist or healthcare professional
            for skin conditions or concerns. Individual results may vary, and we cannot guarantee specific outcomes with recommended products.
          </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage; 