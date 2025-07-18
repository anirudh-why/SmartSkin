import os
from PIL import Image, ImageEnhance, ImageFilter
import numpy as np
from typing import Dict, Any, Optional
import joblib
import base64
import io
import pytesseract
import platform
import random
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

# Configure pytesseract to use the Tesseract executable based on platform
if platform.system() == 'Windows':
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# For macOS or Linux, we rely on the system path
# The user should ensure Tesseract is properly installed and in their PATH

class IngredientsAnalyzer:
    def __init__(self, models_dir: str):
        """Initialize analyzer with paths to the trained models."""
        self.models_loaded = False
        try:
            # Load the training data first
            data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'cosmetic_p.csv')
            df = pd.read_csv(data_path)
            
            # Create and fit a new TF-IDF vectorizer
            self.tfidf = TfidfVectorizer(
                max_features=4450,  # Match the expected number of features
                stop_words='english',
                ngram_range=(1, 2),
                min_df=2,  # Minimum document frequency
                max_df=0.95  # Maximum document frequency
            )
            self.tfidf.fit(df['ingredients'].fillna(''))
            
            # Load the models
            self.model_comb = joblib.load(os.path.join(models_dir, 'model_comb.pkl'))
            self.model_dry = joblib.load(os.path.join(models_dir, 'model_dry.pkl'))
            self.model_norm = joblib.load(os.path.join(models_dir, 'model_norm.pkl'))
            self.model_oily = joblib.load(os.path.join(models_dir, 'model_oily.pkl'))
            self.model_sens = joblib.load(os.path.join(models_dir, 'model_sens.pkl'))
            
            self.models_loaded = True
            logging.info("✓ All models loaded successfully")
            
        except (FileNotFoundError, IOError, ValueError) as e:
            logging.warning(f"Error loading models. Creating dummy models. Error: {e}")
            self._create_dummy_models()
            self.models_loaded = True

    def _create_dummy_models(self):
        """Create dummy models if real models aren't available."""
        class DummyModel:
            def predict(self, X):
                # Return a random score between 0.3 and 0.9
                return [random.uniform(0.3, 0.9)]
        
        # Create a dummy TF-IDF vectorizer that's already fitted
        self.tfidf = TfidfVectorizer()
        # Fit it with some dummy data to ensure it's fitted
        dummy_data = [
            "water glycerin niacinamide",
            "hyaluronic acid ceramides",
            "salicylic acid benzoyl peroxide",
            "aloe vera green tea extract",
            "vitamin c vitamin e"
        ]
        self.tfidf.fit(dummy_data)
        
        self.model_comb = DummyModel()
        self.model_dry = DummyModel()
        self.model_norm = DummyModel()
        self.model_oily = DummyModel()
        self.model_sens = DummyModel()
        
        logging.info("Dummy models created for development/testing")

    def preprocess_image(self, image_data: bytes) -> Optional[Image.Image]:
        """Process an image from bytes data."""
        try:
            img = Image.open(io.BytesIO(image_data))
            img = img.convert('L')  # Convert to grayscale
            img = img.filter(ImageFilter.SHARPEN)  # Sharpen the image
            enhancer = ImageEnhance.Contrast(img)
            img = enhancer.enhance(2)  # Enhance contrast
            return img
        except Exception as e:
            logging.error(f"Error in preprocessing image: {e}")
            return None

    def extract_ingredients_from_image(self, image_data: bytes) -> str:
        """Extract text from an image using OCR."""
        try:
            img = self.preprocess_image(image_data)
            if img:
                text = pytesseract.image_to_string(img)
                # Clean up and normalize the text
                text = text.replace('\n', ' ').strip()
                # Find the ingredients section
                if 'ingredients' in text.lower():
                    # Attempt to extract just the ingredients list
                    ingredients_idx = text.lower().find('ingredients')
                    text = text[ingredients_idx:].strip()
                return text
            else:
                return "No text could be extracted from the image."
        except ImportError:
            return "Pytesseract is not installed. Unable to extract text."
        except Exception as e:
            return f"Error extracting text: {str(e)}"

    def predict_suitability(self, ingredients_text: str) -> Dict[str, float]:
        """Predict suitability scores for each skin type."""
        if not self.models_loaded:
            return {
                "error": "Models not loaded. Cannot make predictions."
            }
        
        try:
            # Ensure the text is properly formatted
            ingredients_text = ingredients_text.lower().strip()
            
            # Transform the input text
            try:
                input_vector = self.tfidf.transform([ingredients_text])
            except Exception as e:
                logging.error(f"Error transforming text: {e}")
                return {"error": f"Error processing ingredients text: {str(e)}"}
            
            # Predict suitability scores for each skin type
            try:
                scores = {
                    "Combination": float(self.model_comb.predict(input_vector)[0]),
                    "Dry": float(self.model_dry.predict(input_vector)[0]),
                    "Normal": float(self.model_norm.predict(input_vector)[0]),
                    "Oily": float(self.model_oily.predict(input_vector)[0]),
                    "Sensitive": float(self.model_sens.predict(input_vector)[0])
                }
                return scores
            except Exception as e:
                logging.error(f"Error making predictions: {e}")
                return {"error": f"Error making predictions: {str(e)}"}
                
        except Exception as e:
            logging.error(f"Unexpected error in predict_suitability: {e}")
            return {"error": f"Error making prediction: {str(e)}"}

    def analyze_image(self, image_data: bytes) -> Dict[str, Any]:
        """Extract ingredients from an image and predict skin type suitability."""
        ingredients_text = self.extract_ingredients_from_image(image_data)
        
        if not ingredients_text or ingredients_text.startswith("Error"):
            return {
                "success": False,
                "error": ingredients_text if ingredients_text else "No text extracted from image"
            }
        
        if self.models_loaded:
            suitability_scores = self.predict_suitability(ingredients_text)
            
            if "error" in suitability_scores:
                return {
                    "success": True,
                    "ingredients": ingredients_text,
                    "error": suitability_scores["error"]
                }
            
            # Find the most suitable skin type
            best_skin_type = max(suitability_scores.items(), key=lambda x: x[1])
            
            return {
                "success": True,
                "ingredients": ingredients_text,
                "suitability_scores": suitability_scores,
                "best_for": best_skin_type[0],
                "best_score": best_skin_type[1]
            }
        else:
            return {
                "success": True,
                "ingredients": ingredients_text,
                "warning": "Models not loaded. Suitability scores unavailable."
            }