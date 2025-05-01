#!/bin/bash

# This script is for diagnosing build issues on Render

echo "=== DIAGNOSTIC INFO ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node -v 2>/dev/null || echo 'Node not found')"
echo "NPM version: $(npm -v 2>/dev/null || echo 'NPM not found')"
echo "Python version: $(python --version 2>&1 || echo 'Python not found')"
echo "System information: $(uname -a)"

echo -e "\n=== DIRECTORY STRUCTURE ==="
ls -la

echo -e "\n=== FRONTEND DIRECTORY ==="
ls -la frontend/ || echo "Frontend directory not found"

echo -e "\n=== CHECKING FOR NODE_MODULES ==="
if [ -d "frontend/node_modules" ]; then
  echo "node_modules exists"
  echo "Size: $(du -sh frontend/node_modules)"
else
  echo "node_modules not found"
fi

echo -e "\n=== CHECKING BUILD SCRIPT ==="
cat build.sh

echo -e "\n=== CHECKING PACKAGE.JSON ==="
cat frontend/package.json

echo -e "\n=== END OF DIAGNOSTIC INFO ===" 