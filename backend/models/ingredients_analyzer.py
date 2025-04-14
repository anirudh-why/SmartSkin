import os
from PIL import Image, ImageEnhance, ImageFilter
import numpy as np
from typing import Dict, Any, Optional
import joblib
import base64
import io
import pytesseract
import platform

# Configure pytesseract to use the Tesseract executable based on platform
if platform.system() == 'Windows':
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# For macOS or Linux, we rely on the system path
# The user should ensure Tesseract is properly installed and in their PATH

class IngredientsAnalyzer:
    def __init__(self, models_dir: str):
        """Initialize analyzer with paths to the trained models."""
        # Load ML models - assumes these exist in the specified directory
        try:
            self.model_comb = joblib.load(os.path.join(models_dir, 'model_comb.pkl'))
            self.model_dry = joblib.load(os.path.join(models_dir, 'model_dry.pkl'))
            self.model_norm = joblib.load(os.path.join(models_dir, 'model_norm.pkl'))
            self.model_oily = joblib.load(os.path.join(models_dir, 'model_oily.pkl'))
            self.model_sens = joblib.load(os.path.join(models_dir, 'model_sens.pkl'))
            self.tfidf = joblib.load(os.path.join(models_dir, 'tfidf_vectorizer.pkl'))
            self.models_loaded = True
        except (FileNotFoundError, IOError):
            self.models_loaded = False
            print("Warning: Models not found. Only image processing will be available.")

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
            print(f"Error in preprocessing image: {e}")
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
            # Prepare the input vector
            input_vector = self.tfidf.transform([ingredients_text])
            
            # Predict suitability scores for each skin type
            scores = {
                "Combination": float(self.model_comb.predict(input_vector)[0]),
                "Dry": float(self.model_dry.predict(input_vector)[0]),
                "Normal": float(self.model_norm.predict(input_vector)[0]),
                "Oily": float(self.model_oily.predict(input_vector)[0]),
                "Sensitive": float(self.model_sens.predict(input_vector)[0])
            }
            
            return scores
        except Exception as e:
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