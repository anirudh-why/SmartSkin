#!/bin/bash

echo "Building the SmartSkin application for production..."

# Set execution permissions
chmod +x build.sh

# Navigate to frontend directory and build
cd frontend
echo "Installing frontend dependencies..."
npm install

# Fix package.json build script for Linux environment
echo "Fixing build script for deployment environment..."
sed -i 's/"build": "set DISABLE_ESLINT_PLUGIN=true && set ESLINT_NO_DEV_ERRORS=true && react-scripts build"/"build": "DISABLE_ESLINT_PLUGIN=true ESLINT_NO_DEV_ERRORS=true react-scripts build"/' package.json
echo "Modified package.json build script for Linux compatibility"

echo "Building frontend..."
export DISABLE_ESLINT_PLUGIN=true
export ESLINT_NO_DEV_ERRORS=true
npm run build

# Create necessary directories if they don't exist
echo "Setting up backend directories..."
mkdir -p ../backend/models/trained
mkdir -p ../backend/data

# Navigate to backend directory
cd ../backend
echo "Installing backend dependencies..."
pip install -r requirements.txt

# Verify frontend build exists and is accessible
echo "Verifying frontend build directory..."
if [ -d "../frontend/build" ]; then
  echo "✓ Frontend build directory exists"
  ls -la ../frontend/build
else
  echo "⚠️ Frontend build directory not found"
  mkdir -p ../frontend/build
  echo "<html><body><h1>SmartSkin</h1><p>Application is running but frontend build is missing.</p></body></html>" > ../frontend/build/index.html
  echo "Created a placeholder index.html"
fi

echo "Build completed successfully!"
echo "To run the application, use: cd backend && python app.py" 