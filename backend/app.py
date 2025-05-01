import os
import sys
import glob
from flask import Flask, send_from_directory, jsonify, render_template_string
from flask_cors import CORS
from api.routes import api

def create_app():
    """Create and configure the Flask application."""
    # Get absolute path to the frontend build directory
    frontend_build_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'build'))
    
    # Print debugging info about paths
    print(f"Current working directory: {os.getcwd()}")
    print(f"App file location: {__file__}")
    print(f"Frontend build directory: {frontend_build_dir}")
    print(f"Directory exists: {os.path.exists(frontend_build_dir)}")
    if os.path.exists(frontend_build_dir):
        print(f"Contents: {os.listdir(frontend_build_dir)}")
    
    app = Flask(__name__, static_folder=frontend_build_dir)
    CORS(app)  # Enable CORS for all routes

    # Register API blueprint
    app.register_blueprint(api, url_prefix='/api')

    # Create data directory if it doesn't exist
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    os.makedirs(data_dir, exist_ok=True)
    print(f"✓ Data directory: {data_dir}")
    
    model_dir = os.path.join(os.path.dirname(__file__), 'models', 'trained')
    os.makedirs(model_dir, exist_ok=True)
    print(f"✓ Models directory: {model_dir}")
    
    # Debug route to check if the server is running
    @app.route('/api/status')
    def status():
        frontend_files = []
        if os.path.exists(frontend_build_dir):
            frontend_files = glob.glob(os.path.join(frontend_build_dir, '*'))
        
        return jsonify({
            'status': 'running',
            'python_version': sys.version,
            'env': os.environ.get('FLASK_ENV', 'not set'),
            'static_folder': app.static_folder,
            'static_folder_exists': os.path.exists(app.static_folder) if app.static_folder else False,
            'frontend_build_dir': frontend_build_dir,
            'frontend_build_exists': os.path.exists(frontend_build_dir),
            'frontend_files': frontend_files
        })
    
    # Force-create a minimal index.html if needed (for testing)
    @app.route('/api/create-index')
    def create_index():
        if not os.path.exists(frontend_build_dir):
            os.makedirs(frontend_build_dir, exist_ok=True)
        
        index_path = os.path.join(frontend_build_dir, 'index.html')
        with open(index_path, 'w') as f:
            f.write('<html><body><h1>SmartSkin</h1><p>Generated index.html</p></body></html>')
        
        return jsonify({
            'success': True,
            'path': index_path,
            'exists': os.path.exists(index_path)
        })
    
    # Serve React frontend in production
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        print(f"Serving path: {path}")
        if path and os.path.exists(os.path.join(app.static_folder, path)):
            print(f"Serving file from static folder: {path}")
            return send_from_directory(app.static_folder, path)
        else:
            index_path = os.path.join(app.static_folder, 'index.html')
            if os.path.exists(index_path):
                print(f"Serving index.html")
                return send_from_directory(app.static_folder, 'index.html')
            else:
                print(f"Index.html not found at {index_path}")
                return render_template_string('''
                <html>
                <head><title>SmartSkin</title></head>
                <body>
                    <h1>SmartSkin API Server</h1>
                    <p>The server is running, but the frontend build was not found.</p>
                    <p>Please check <a href="/api/status">/api/status</a> for more information.</p>
                    <p>You can attempt to create an index.html file by visiting <a href="/api/create-index">/api/create-index</a>.</p>
                </body>
                </html>
                ''')

    return app

# Create a gunicorn-compatible app instance
app = create_app()

if __name__ == '__main__':
    # Set debug to False in production
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=debug_mode, host='0.0.0.0', port=port) 