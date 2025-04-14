# SmartSkin - AI-Powered Skincare Assistant

SmartSkin is a web application that helps users make better skincare decisions using artificial intelligence. The app features product recommendations based on skin type and preferences, as well as ingredient analysis using image recognition technology.

## Features

- **Personalized Product Recommendations**: Get tailored skincare product recommendations based on your skin type, concerns, and preferences.
- **Ingredient Analysis**: Analyze product ingredients by uploading an image or entering text to determine compatibility with different skin types.
- **User-Friendly Interface**: Modern, responsive design built with React and Tailwind CSS.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Python, Flask
- **AI/ML**: Machine Learning models for ingredient analysis and product recommendations

## Installation

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- pip (Python package manager)

### Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd smartskin-app
   ```

2. Install backend dependencies:
   ```
   cd backend
   pip install -r requirements.txt
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

4. Ensure you have the required data files:
   - Place `cosmetic_p.csv` in the project root directory (for product data)
   - Create a `trained` directory inside `backend/models/` and place the trained model files inside:
     - `model_comb.pkl`
     - `model_dry.pkl`
     - `model_norm.pkl`
     - `model_oily.pkl`
     - `model_sens.pkl`
     - `tfidf_vectorizer.pkl`

## Running the Application

### Development Mode

1. Start the backend server:
   ```
   cd backend
   python app.py
   ```

2. In a separate terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Access the application at `http://localhost:3000`

### Production Mode

1. Build the frontend:
   ```
   cd frontend
   npm run build
   ```

2. Run the Flask server which will serve both the API and the built frontend:
   ```
   cd ../backend
   python app.py
   ```

3. Access the application at `http://localhost:5000`

## Usage

1. **Product Recommendations**:
   - Navigate to the Recommender page
   - Select your skin type and preferences
   - Submit to see personalized product recommendations

2. **Ingredient Analysis**:
   - Navigate to the Analyzer page
   - Choose a method: enter text, upload an image, or use camera
   - Review the analysis results showing ingredient compatibility with different skin types

## Notes

- If the image analysis feature is not working, ensure you have Tesseract OCR installed on your system for text extraction from images.
- For optimal image analysis, ensure the ingredient list is clearly visible in the photo.

## License

[MIT License](LICENSE)

## Acknowledgements

- This project uses data from a comprehensive skincare product database.
- Special thanks to the open-source community for the tools and libraries used in this project.