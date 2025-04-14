import pandas as pd
import numpy as np
from typing import Dict, List, Any
import os
import json
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder

class RoutineRecommender:
    def __init__(self, data_path: str = None, model_path: str = None):
        """
        Initialize the routine recommender with trained models or train new ones.
        
        Args:
            data_path: Path to training data CSV
            model_path: Path to save/load trained models
        """
        self.skin_types = ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive']
        self.skin_concerns = ['Acne', 'Aging', 'Dryness', 'Oily', 'Sensitive', 'Brightening', 'Redness']
        self.routines = {
            'morning': ['Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Sunscreen'],
            'evening': ['Cleanser', 'Toner', 'Serum', 'Treatment', 'Moisturizer']
        }
        
        # Product-to-ingredient mappings for routine products
        self.product_ingredients = {
            'Cleanser': {
                'Oily': ['Salicylic Acid', 'Benzoyl Peroxide', 'Niacinamide', 'Tea Tree Oil'],
                'Dry': ['Hyaluronic Acid', 'Glycerin', 'Ceramides', 'Squalane'],
                'Combination': ['Niacinamide', 'Glycerin', 'Green Tea', 'Aloe Vera'],
                'Normal': ['Glycerin', 'Aloe Vera', 'Green Tea', 'Panthenol'],
                'Sensitive': ['Aloe Vera', 'Chamomile', 'Oat Extract', 'Centella Asiatica']
            },
            'Toner': {
                'Oily': ['Salicylic Acid', 'Witch Hazel', 'Niacinamide', 'Green Tea'],
                'Dry': ['Hyaluronic Acid', 'Glycerin', 'Rose Water', 'Amino Acids'],
                'Combination': ['Niacinamide', 'Hyaluronic Acid', 'Green Tea', 'Alpha-Hydroxy Acids'],
                'Normal': ['Hyaluronic Acid', 'Glycerin', 'Niacinamide', 'Panthenol'],
                'Sensitive': ['Hyaluronic Acid', 'Aloe Vera', 'Chamomile', 'Panthenol']
            },
            'Serum': {
                'Oily': ['Niacinamide', 'Zinc', 'Salicylic Acid', 'Alpha Hydroxy Acids'],
                'Dry': ['Hyaluronic Acid', 'Peptides', 'Squalane', 'Panthenol'],
                'Combination': ['Niacinamide', 'Hyaluronic Acid', 'Peptides', 'Vitamin C'],
                'Normal': ['Vitamin C', 'Niacinamide', 'Peptides', 'Antioxidants'],
                'Sensitive': ['Centella Asiatica', 'Hyaluronic Acid', 'Panthenol', 'Peptides']
            },
            'Treatment': {
                'Oily': ['Retinol', 'Alpha Hydroxy Acids', 'Beta Hydroxy Acids', 'Benzoyl Peroxide'],
                'Dry': ['Retinol', 'Lactic Acid', 'Peptides', 'Plant Oils'],
                'Combination': ['Retinol', 'Alpha Hydroxy Acids', 'Niacinamide', 'Azelaic Acid'],
                'Normal': ['Retinol', 'Alpha Hydroxy Acids', 'Peptides', 'Vitamin C'],
                'Sensitive': ['Bakuchiol', 'Azelaic Acid', 'Cica', 'Niacinamide']
            },
            'Moisturizer': {
                'Oily': ['Hyaluronic Acid', 'Niacinamide', 'Zinc', 'Aloe Vera'],
                'Dry': ['Hyaluronic Acid', 'Ceramides', 'Squalane', 'Shea Butter'],
                'Combination': ['Hyaluronic Acid', 'Niacinamide', 'Ceramides', 'Glycerin'],
                'Normal': ['Hyaluronic Acid', 'Ceramides', 'Peptides', 'Antioxidants'],
                'Sensitive': ['Ceramides', 'Oat Extract', 'Aloe Vera', 'Squalane']
            },
            'Sunscreen': {
                'Oily': ['Zinc Oxide', 'Oil-Free', 'Niacinamide', 'Silica'],
                'Dry': ['Chemical Filters', 'Glycerin', 'Hyaluronic Acid', 'Vitamin E'],
                'Combination': ['Hybrid Filters', 'Niacinamide', 'Vitamin E', 'Silica'],
                'Normal': ['Hybrid Filters', 'Vitamin E', 'Antioxidants', 'Hyaluronic Acid'],
                'Sensitive': ['Zinc Oxide', 'Titanium Dioxide', 'Niacinamide', 'Squalane']
            }
        }
        
        # Concern-based additional products
        self.concern_products = {
            'Acne': {'Spot Treatment': ['Benzoyl Peroxide', 'Salicylic Acid', 'Tea Tree Oil', 'Sulfur']},
            'Aging': {'Antioxidant Serum': ['Vitamin C', 'Vitamin E', 'Ferulic Acid', 'CoQ10']},
            'Dryness': {'Facial Oil': ['Squalane', 'Jojoba Oil', 'Argan Oil', 'Rosehip Oil']},
            'Oily': {'Oil-Control Primer': ['Kaolin Clay', 'Silica', 'Witch Hazel', 'Zinc']},
            'Sensitive': {'Soothing Mask': ['Oat Extract', 'Aloe Vera', 'Chamomile', 'Centella Asiatica']},
            'Brightening': {'Brightening Serum': ['Vitamin C', 'Alpha Arbutin', 'Kojic Acid', 'Licorice Root']},
            'Redness': {'Calming Serum': ['Centella Asiatica', 'Green Tea', 'Azelaic Acid', 'Niacinamide']}
        }
        
        # Weather-based adaptations
        self.weather_adaptations = {
            'hot_humid': {
                'Moisturizer': {'Oily': 'Gel', 'Dry': 'Lotion', 'Combination': 'Gel', 'Normal': 'Lotion', 'Sensitive': 'Lotion'},
                'Sunscreen': {'All': 'Water-resistant SPF 50+'}
            },
            'cold_dry': {
                'Moisturizer': {'Oily': 'Lotion', 'Dry': 'Cream', 'Combination': 'Lotion', 'Normal': 'Cream', 'Sensitive': 'Cream'},
                'Add': {'All': 'Humectant Serum'}
            },
            'mild': {
                'Moisturizer': {'Oily': 'Gel', 'Dry': 'Lotion', 'Combination': 'Lotion', 'Normal': 'Lotion', 'Sensitive': 'Lotion'}
            }
        }
        
        self.model_path = model_path
        self.data_path = data_path
        self.model = None
        self.encoder = None
        
        # Initialize/load model if paths are provided
        if data_path and model_path:
            self.initialize_model()
    
    def initialize_model(self):
        """Initialize or load the trained model."""
        model_file = os.path.join(self.model_path, 'routine_model.pkl')
        encoder_file = os.path.join(self.model_path, 'routine_encoder.pkl')
        
        if os.path.exists(model_file) and os.path.exists(encoder_file):
            # Load existing model
            self.model = joblib.load(model_file)
            self.encoder = joblib.load(encoder_file)
        else:
            # Train new model if data is available
            if os.path.exists(self.data_path):
                self.train_model()
            else:
                print(f"Warning: Training data not found at {self.data_path}")
    
    def train_model(self):
        """Train a model to predict routine steps based on user data."""
        try:
            # In a real implementation, this would use the training data
            # For this example, we'll create a simple rule-based model
            print("Training routine recommendation model...")
            
            # Create a simple random forest classifier as a placeholder
            self.model = RandomForestClassifier(n_estimators=100, random_state=42)
            self.encoder = OneHotEncoder(sparse=False, handle_unknown='ignore')
            
            # Save model
            os.makedirs(self.model_path, exist_ok=True)
            joblib.dump(self.model, os.path.join(self.model_path, 'routine_model.pkl'))
            joblib.dump(self.encoder, os.path.join(self.model_path, 'routine_encoder.pkl'))
            print("Model trained and saved successfully")
            
        except Exception as e:
            print(f"Error training model: {str(e)}")
    
    def get_personalized_routine(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a personalized skincare routine based on user data.
        
        Args:
            user_data: Dictionary containing user information including skin_type,
                       skin_concerns, age, climate, and allergies
        
        Returns:
            A personalized skincare routine with morning and evening steps
        """
        skin_type = user_data.get('skin_type', 'Normal')
        concerns = user_data.get('skin_concerns', [])
        allergies = user_data.get('allergies', [])
        climate = user_data.get('climate', 'mild')
        
        # Build base routines for morning and evening
        routine = {
            'morning': [],
            'evening': []
        }
        
        # Add base products for each routine
        for time, steps in self.routines.items():
            for step in steps:
                # Skip sunscreen for evening routine
                if time == 'evening' and step == 'Sunscreen':
                    continue
                    
                product = {
                    'step': step,
                    'recommended_ingredients': [],
                    'avoid_ingredients': self._get_ingredients_to_avoid(skin_type, allergies)
                }
                
                # Add recommended ingredients based on skin type
                if step in self.product_ingredients and skin_type in self.product_ingredients[step]:
                    product['recommended_ingredients'] = self.product_ingredients[step][skin_type]
                
                # Apply climate-based adaptations
                if climate in self.weather_adaptations and step in self.weather_adaptations[climate]:
                    if skin_type in self.weather_adaptations[climate][step]:
                        product['texture'] = self.weather_adaptations[climate][step][skin_type]
                    elif 'All' in self.weather_adaptations[climate][step]:
                        product['texture'] = self.weather_adaptations[climate][step]['All']
                
                routine[time].append(product)
        
        # Add concern-specific products
        for concern in concerns:
            if concern in self.concern_products:
                for step, ingredients in self.concern_products[concern].items():
                    # Add concern-specific product to evening routine
                    concern_product = {
                        'step': step,
                        'recommended_ingredients': ingredients,
                        'avoid_ingredients': self._get_ingredients_to_avoid(skin_type, allergies)
                    }
                    routine['evening'].append(concern_product)
        
        # Add weekly treatments based on skin type and concerns
        routine['weekly'] = self._get_weekly_treatments(skin_type, concerns)
        
        return routine
    
    def _get_ingredients_to_avoid(self, skin_type: str, allergies: List[str]) -> List[str]:
        """Get ingredients to avoid based on skin type and allergies."""
        avoid_ingredients = []
        
        # Add common irritants based on skin type
        if skin_type == 'Sensitive':
            avoid_ingredients.extend(['Alcohol Denat', 'Fragrance', 'Essential Oils', 'Sulfates'])
        elif skin_type == 'Dry':
            avoid_ingredients.extend(['Alcohol Denat', 'Sulfates'])
        
        # Add user's allergies
        avoid_ingredients.extend(allergies)
        
        return avoid_ingredients
    
    def _get_weekly_treatments(self, skin_type: str, concerns: List[str]) -> List[Dict]:
        """Get recommended weekly treatments based on skin type and concerns."""
        treatments = []
        
        # Exfoliation recommendation
        if skin_type == 'Oily' or 'Acne' in concerns:
            treatments.append({
                'step': 'Chemical Exfoliant',
                'frequency': '2-3 times per week',
                'recommended_ingredients': ['Salicylic Acid', 'Beta Hydroxy Acids']
            })
        elif skin_type == 'Dry':
            treatments.append({
                'step': 'Gentle Exfoliant',
                'frequency': '1-2 times per week',
                'recommended_ingredients': ['Lactic Acid', 'PHAs']
            })
        elif skin_type == 'Combination' or skin_type == 'Normal':
            treatments.append({
                'step': 'Chemical Exfoliant',
                'frequency': '1-2 times per week',
                'recommended_ingredients': ['Glycolic Acid', 'Lactic Acid', 'AHAs']
            })
        elif skin_type == 'Sensitive':
            treatments.append({
                'step': 'Ultra-Gentle Exfoliant',
                'frequency': 'Once per week',
                'recommended_ingredients': ['PHAs', 'Mandelic Acid']
            })
        
        # Mask recommendation
        if skin_type == 'Oily' or 'Acne' in concerns:
            treatments.append({
                'step': 'Clay Mask',
                'frequency': 'Once per week',
                'recommended_ingredients': ['Kaolin Clay', 'Bentonite Clay', 'Charcoal']
            })
        elif skin_type == 'Dry' or 'Dryness' in concerns:
            treatments.append({
                'step': 'Hydrating Mask',
                'frequency': '1-2 times per week',
                'recommended_ingredients': ['Hyaluronic Acid', 'Glycerin', 'Honey', 'Aloe Vera']
            })
        elif 'Aging' in concerns:
            treatments.append({
                'step': 'Antioxidant Mask',
                'frequency': 'Once per week',
                'recommended_ingredients': ['Vitamin C', 'Vitamin E', 'CoQ10', 'Green Tea']
            })
        elif 'Brightening' in concerns:
            treatments.append({
                'step': 'Brightening Mask',
                'frequency': 'Once per week',
                'recommended_ingredients': ['Vitamin C', 'Licorice Root', 'Alpha Arbutin', 'Niacinamide']
            })
        
        return treatments
    
    def get_product_recommendations(self, routine: Dict[str, Any], product_data: pd.DataFrame) -> Dict[str, Any]:
        """
        Match routine steps with actual product recommendations.
        
        Args:
            routine: Generated skincare routine
            product_data: DataFrame with product information
        
        Returns:
            Updated routine with product recommendations for each step
        """
        result = routine.copy()
        
        # For each time of day in the routine
        for time in result.keys():
            if isinstance(result[time], list):  # Skip if not a list (like metadata)
                # For each step in the routine
                for i, step in enumerate(result[time]):
                    if isinstance(step, dict) and 'step' in step:
                        # Filter products by category
                        category_filter = product_data['Label'] == step['step']
                        if sum(category_filter) == 0:  # If exact match not found, try partial match
                            category_filter = product_data['Label'].str.contains(step['step'], case=False)
                        
                        filtered_products = product_data[category_filter]
                        
                        if not filtered_products.empty:
                            # Further filter by recommended ingredients if possible
                            if 'recommended_ingredients' in step and step['recommended_ingredients']:
                                ingredient_scores = []
                                
                                for _, product in filtered_products.iterrows():
                                    score = sum(1 for ing in step['recommended_ingredients'] 
                                               if ing.lower() in product['ingredients'].lower())
                                    ingredient_scores.append(score)
                                
                                if max(ingredient_scores) > 0:  # If some products match ingredients
                                    filtered_products = filtered_products.iloc[
                                        [i for i, score in enumerate(ingredient_scores) if score > 0]
                                    ]
                            
                            # Get top 3 products by rank
                            top_products = filtered_products.sort_values('rank', ascending=False).head(3)
                            
                            # Add product recommendations to the routine step
                            result[time][i]['product_recommendations'] = [
                                {
                                    'brand': product['brand'],
                                    'name': product['name'],
                                    'rating': product['rank']
                                }
                                for _, product in top_products.iterrows()
                            ]
        
        return result 