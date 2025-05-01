#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# This is a fallback script that creates a minimal frontend build
# without using react-scripts, in case the main build process fails.

echo "=== Creating minimal frontend build ==="

# Remove any existing build directory to avoid conflicts
rm -rf frontend/build || true

# Create build directory in frontend folder
mkdir -p frontend/build || true

# Create a minimal index.html file
cat > frontend/build/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartSkin</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        .header {
            background-color: #4a90e2;
            color: white;
            padding: 1rem 0;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .content {
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            margin-top: 2rem;
        }
        .footer {
            text-align: center;
            padding: 1rem 0;
            margin-top: 2rem;
            color: #666;
        }
        .btn {
            padding: 0.5rem 1rem;
            background-color: #4a90e2;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .btn:hover {
            background-color: #3a7bca;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>SmartSkin</h1>
        <p>AI-Powered Skincare Assistant</p>
    </div>
    
    <div class="container">
        <div class="content">
            <h2>Welcome to SmartSkin</h2>
            <p>This is a minimal version of the SmartSkin frontend. The full React application build process encountered issues, so we've created this simple version to ensure you can still access the API.</p>
            
            <h3>API Status</h3>
            <div id="apiStatus">Checking API status...</div>
            
            <h3>Available Features</h3>
            <ul>
                <li>Check API status at <a href="/api/status">/api/status</a></li>
                <li>Return to the full application when it's available</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>&copy; 2023 SmartSkin. All rights reserved.</p>
        </div>
    </div>
    
    <script>
        // Simple script to check API status
        fetch('/api/status')
            .then(response => response.json())
            .then(data => {
                document.getElementById('apiStatus').innerHTML = 
                    `<div style="background-color: #e0f7e0; padding: 1rem; border-radius: 4px;">
                        <p><strong>Status:</strong> ${data.status}</p>
                        <p><strong>Python Version:</strong> ${data.python_version}</p>
                        <p><strong>Environment:</strong> ${data.env}</p>
                    </div>`;
            })
            .catch(error => {
                document.getElementById('apiStatus').innerHTML = 
                    `<div style="background-color: #f7e0e0; padding: 1rem; border-radius: 4px;">
                        <p>Error connecting to API: ${error.message}</p>
                    </div>`;
            });
    </script>
</body>
</html>
EOL

# Create a basic CSS file
cat > frontend/build/styles.css << 'EOL'
/* Additional styles can be added here */
EOL

# Set proper permissions
echo "Setting build directory permissions..."
chmod -R 755 frontend/build || true

# Let the user know we're done
echo "=== Minimal frontend build created ==="
echo "Created files:"
ls -la frontend/build/

# Don't modify render.yaml anymore as we've already updated it
# if grep -q "minimal-build.sh" render.yaml; then
#     echo "minimal-build.sh already in render.yaml"
# else
#     echo "Adding minimal-build.sh to render.yaml preDeployCommand"
#     sed -i 's/preDeployCommand: \.\/diagnose.sh/preDeployCommand: \.\/diagnose.sh \&\& \.\/minimal-build.sh/' render.yaml
# fi

echo "Done!"
exit 0  # Always exit with success 