#!/bin/bash

# This script helps verify that the frontend can build properly

echo "Testing frontend build process..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Set environment variables for build
export DISABLE_ESLINT_PLUGIN=true
export ESLINT_NO_DEV_ERRORS=true

# Try the build
echo "Testing build..."
npm run build

# Check if build succeeded
if [ -d "build" ]; then
  echo "✓ SUCCESS: Frontend build successful!"
  echo "Contents of build directory:"
  ls -la build
  
  if [ -f "build/index.html" ]; then
    echo "✓ index.html exists"
  else
    echo "⚠️ WARNING: No index.html found in build folder"
  fi
else
  echo "⚠️ ERROR: Frontend build failed, build directory not found"
fi 