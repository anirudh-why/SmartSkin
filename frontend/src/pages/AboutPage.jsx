import React from 'react';

function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6 text-center">
          About SmartSkin
        </h1>
        
        <div className="prose prose-primary prose-lg mx-auto">
          <p>
            SmartSkin is an AI-powered skincare assistant designed to help you make more informed decisions about the products you use on your skin.
          </p>
          
          <h2>Our Features</h2>
          
          <h3>Personalized Product Recommendations</h3>
          <p>
            Our recommendation engine analyzes your skin type, concerns, and preferences to suggest products that are most likely to work well for you.
            By considering factors such as ingredient compatibility and user ratings, we provide tailored recommendations from our extensive database
            of skincare products.
          </p>
          
          <h3>Ingredient Analysis</h3>
          <p>
            Our image recognition technology can extract ingredient lists from product packaging, and our AI algorithm analyzes these ingredients to 
            determine their suitability for different skin types. You can also manually input ingredients for analysis if you prefer.
          </p>
          
          <h2>How It Works</h2>
          <p>
            SmartSkin uses machine learning models trained on extensive datasets of skincare products, ingredients, and their effects on different skin types.
            Our recommendation engine matches your specific needs with product characteristics, while our ingredient analyzer evaluates the compatibility of 
            product ingredients with various skin types.
          </p>
          
          <h2>Privacy & Data Usage</h2>
          <p>
            We take your privacy seriously. Images uploaded for ingredient analysis are processed on our secure servers and are not stored permanently.
            Your preferences and skin information are only used to provide you with better recommendations and are never shared with third parties.
          </p>
          
          <h2>Disclaimer</h2>
          <p>
            SmartSkin is designed to provide information and suggestions, not medical advice. Always consult with a dermatologist or healthcare professional
            for skin conditions or concerns. Individual results may vary, and we cannot guarantee specific outcomes with recommended products.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage; 