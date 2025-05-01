import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from api.routes import api

def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__, static_folder='../frontend/build')
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
    
    # Serve React frontend in production
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    return app

# Create a gunicorn-compatible app instance
app = create_app()

if __name__ == '__main__':
    # Set debug to False in production
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=debug_mode, host='0.0.0.0', port=port) 