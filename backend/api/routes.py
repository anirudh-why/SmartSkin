from flask import Blueprint, request, jsonify
import os
import base64
from models.skincare_recommender import SkincareRecommender
from models.ingredients_analyzer import IngredientsAnalyzer

# Create blueprint for API routes
api = Blueprint('api', __name__)

# Define file paths
data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'cosmetic_p.csv')
models_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models', 'trained')

# Initialize models lazily only when needed
recommender = None
analyzer = None

def get_recommender():
    global recommender
    if recommender is None:
        print(f"Initializing recommender with data from: {data_path}")
        if not os.path.exists(data_path):
            # Try to find the CSV file in other locations
            possible_csv_paths = [
                # Parent directory
                os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'cosmetic_p.csv'),
                # Root directory (two levels up)
                os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'cosmetic_p.csv'),
                # Absolute path from workspace root
                os.path.join(os.path.abspath(os.sep), 'c:', 'Users', 'aniru', 'OneDrive', 'Desktop', 'SmartSkin', 'cosmetic_p.csv')
            ]
            
            for source_path in possible_csv_paths:
                if os.path.exists(source_path):
                    try:
                        # Ensure the data directory exists
                        os.makedirs(os.path.dirname(data_path), exist_ok=True)
                        import shutil
                        shutil.copy(source_path, data_path)
                        print(f"✓ Copied CSV from {source_path} to {data_path}")
                        break
                    except Exception as e:
                        print(f"Error copying CSV: {e}")
        
        if not os.path.exists(data_path):
            raise FileNotFoundError(f"Could not find or copy cosmetic_p.csv to {data_path}")
            
        recommender = SkincareRecommender(data_path)
    return recommender

def get_analyzer():
    global analyzer
    if analyzer is None:
        analyzer = IngredientsAnalyzer(models_dir)
    return analyzer

@api.route('/recommender/metadata', methods=['GET'])
def get_metadata():
    """Get all metadata needed for the recommendation form."""
    try:
        rec = get_recommender()
        return jsonify({
            'skin_types': rec.get_skin_types(),
            'categories': rec.get_categories(),
            'skin_concerns': rec.get_skin_concerns(),
            'common_ingredients': rec.get_common_ingredients()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/recommender/recommendations', methods=['POST'])
def get_recommendations():
    """Get product recommendations based on user preferences."""
    data = request.json
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Validate input data
    try:
        user_prefs = {
            'skin_type': data.get('skin_type', 'Normal'),
            'skin_concerns': data.get('skin_concerns', []),
            'preferred_ingredients': data.get('preferred_ingredients', []),
            'allergies': data.get('allergies', []),
            'preferred_categories': data.get('preferred_categories', [])
        }
        
        rec = get_recommender()
        recommendations = rec.get_recommendations(user_prefs)
        return jsonify({'recommendations': recommendations})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/analyzer/analyze', methods=['POST'])
def analyze_image():
    """Analyze a product image to extract ingredients and predict suitability."""
    if 'image' not in request.json:
        return jsonify({'error': 'No image provided'}), 400
    
    try:
        # Get base64 encoded image from request
        image_data = base64.b64decode(request.json['image'].split(',')[1] if ',' in request.json['image'] else request.json['image'])
        
        # Analyze the image
        a = get_analyzer()
        result = a.analyze_image(image_data)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

@api.route('/analyzer/ingredients', methods=['POST'])
def analyze_ingredients_text():
    """Analyze ingredients text to predict suitability for different skin types."""
    if 'ingredients' not in request.json:
        return jsonify({'error': 'No ingredients text provided'}), 400
    
    try:
        ingredients_text = request.json['ingredients']
        
        a = get_analyzer()
        if not a.models_loaded:
            return jsonify({
                'success': False,
                'error': 'Models not loaded. Cannot analyze ingredients.'
            }), 500
        
        # Analyze ingredients text
        suitability_scores = a.predict_suitability(ingredients_text)
        
        if "error" in suitability_scores:
            return jsonify({
                'success': False,
                'error': suitability_scores["error"]
            }), 500
        
        # Find the most suitable skin type
        best_skin_type = max(suitability_scores.items(), key=lambda x: x[1])
        
        return jsonify({
            'success': True,
            'suitability_scores': suitability_scores,
            'best_for': best_skin_type[0],
            'best_score': best_skin_type[1]
        })
    
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500 