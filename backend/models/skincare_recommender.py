import pandas as pd
from typing import List, Dict
from difflib import get_close_matches
import re

class SkincareRecommender:
    def __init__(self, data_path: str):
        """Initialize the recommender with a dataset."""
        self.df = pd.read_csv(data_path)
        self.skin_types = ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive']
        self.categories = list(self.df['Label'].unique())
        self.skin_concerns = ['Acne', 'Aging', 'Dryness', 'Oily', 'Sensitive', 'Brightening', 'Redness']
        self.common_ingredients = ['Hyaluronic Acid', 'Niacinamide', 'Retinol', 'Vitamin C', 'Salicylic Acid', 
                                   'Peptides', 'Ceramides', 'Green Tea', 'Aloe Vera', 'Glycerin']
    
    def get_recommendations(self, user_prefs: Dict) -> List[Dict]:
        """Generate product recommendations based on user preferences."""
        recommendations = []
        
        # Apply filters
        filtered_df = self.df.copy()
        
        # Filter by categories if specified
        if user_prefs.get('preferred_categories'):
            filtered_df = filtered_df[filtered_df['Label'].isin(user_prefs['preferred_categories'])]
        
        # Filter by skin type
        skin_type = user_prefs.get('skin_type', 'Normal')
        filtered_df = filtered_df[filtered_df[skin_type] == 1]
        
        for _, product in filtered_df.iterrows():
            # Check for allergens
            allergies = user_prefs.get('allergies', [])
            contains_allergen = any(allergy.lower() in product['ingredients'].lower() for allergy in allergies) if allergies else False
            
            if contains_allergen:
                continue
            
            # Calculate scores
            preferred_ingredients = user_prefs.get('preferred_ingredients', [])
            preferred_match = sum(ing.lower() in product['ingredients'].lower() for ing in preferred_ingredients) if preferred_ingredients else 0
            
            skin_concerns = user_prefs.get('skin_concerns', [])
            concern_match = sum(concern.lower() in product['ingredients'].lower() for concern in skin_concerns) if skin_concerns else 0
            
            total_score = product['rank'] * 2 + preferred_match * 1.5 + concern_match * 2
            
            recommendations.append({
                'id': int(_),  # Add an ID for frontend use
                'label': product['Label'],
                'brand': product['brand'],
                'name': product['name'],
                'score': total_score,
                'rating': product['rank'],
                'price': product.get('Price', 0),
                'ingredients': product['ingredients'][:150] + '...' if len(product['ingredients']) > 150 else product['ingredients']
            })
        
        # Sort by score and limit to top 8
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:8]
    
    def get_categories(self):
        """Return available product categories."""
        return self.categories
    
    def get_skin_types(self):
        """Return available skin types."""
        return self.skin_types
    
    def get_skin_concerns(self):
        """Return common skin concerns."""
        return self.skin_concerns
    
    def get_common_ingredients(self):
        """Return common ingredients."""
        return self.common_ingredients 