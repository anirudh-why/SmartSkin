#!/bin/bash

echo "Building the SmartSkin application for production..."

# Navigate to frontend directory and build
cd frontend
echo "Installing frontend dependencies..."
npm install
echo "Building frontend..."
npm run build

# Navigate to backend directory
cd ../backend
echo "Installing backend dependencies..."
pip install -r requirements.txt

echo "Build completed successfully!"
echo "To run the application, use: cd backend && python app.py" 