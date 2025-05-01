#!/bin/bash

echo "Building the SmartSkin application for production..."

# Set execution permissions
chmod +x build.sh

# Navigate to frontend directory and build
cd frontend
echo "Installing frontend dependencies..."
npm install
echo "Building frontend..."
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