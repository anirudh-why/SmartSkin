import pandas as pd
import numpy as np
from typing import List, Dict
from difflib import get_close_matches
import re
import os

class SkincareRecommender:
    def __init__(self, data_path: str):
        """Initialize the recommender with a dataset."""
        try:
            if os.path.exists(data_path):
                self.df = pd.read_csv(data_path)
                print(f"✓ Loaded skincare dataset from {data_path}")
            else:
                print(f"Dataset not found at {data_path}. Creating dummy data.")
                self._create_dummy_data()
        except Exception as e:
            print(f"Error loading dataset: {e}. Creating dummy data.")
            self._create_dummy_data()
            
        self.skin_types = ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive']
        self.categories = list(self.df['Label'].unique())
        self.skin_concerns = ['Acne', 'Aging', 'Dryness', 'Oily', 'Sensitive', 'Brightening', 'Redness']
        self.common_ingredients = ['Hyaluronic Acid', 'Niacinamide', 'Retinol', 'Vitamin C', 'Salicylic Acid', 
                                   'Peptides', 'Ceramides', 'Green Tea', 'Aloe Vera', 'Glycerin']
    
    def _create_dummy_data(self):
        """Create dummy data for testing."""
        # Define product categories
        categories = ['Cleanser', 'Moisturizer', 'Serum', 'Mask', 'Sunscreen']
        
        # Sample brands and product names
        brands = ['CeraVe', 'The Ordinary', 'Neutrogena', 'La Roche-Posay', 'Cetaphil']
        product_templates = {
            'Cleanser': ['Hydrating Cleanser', 'Foaming Face Wash', 'Gentle Skin Cleanser'],
            'Moisturizer': ['Daily Moisturizer', 'Hydrating Cream', 'Ultra Repair Cream'],
            'Serum': ['Vitamin C Serum', 'Hyaluronic Acid Serum', 'Niacinamide Serum'],
            'Mask': ['Clay Mask', 'Overnight Mask', 'Sheet Mask'],
            'Sunscreen': ['SPF 30 Sunscreen', 'Daily Defense SPF 50', 'Mineral Sunscreen']
        }
        
        # Sample ingredients
        ingredients_templates = {
            'Cleanser': 'Water, Glycerin, Sodium Laureth Sulfate, Cocamidopropyl Betaine, PEG-120 Methyl Glucose Dioleate',
            'Moisturizer': 'Water, Glycerin, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Cetyl Alcohol, Dimethicone',
            'Serum': 'Water, Propanediol, Niacinamide, Zinc PCA, Glycerin, Hyaluronic Acid',
            'Mask': 'Kaolin, Bentonite, Glycerin, Water, Propylene Glycol, Montmorillonite',
            'Sunscreen': 'Zinc Oxide, Titanium Dioxide, Glycerin, Isododecane, Dimethicone, Niacinamide'
        }
        
        # Create 20 dummy products
        data = []
        for i in range(20):
            category = np.random.choice(categories)
            brand = np.random.choice(brands)
            name = np.random.choice(product_templates[category])
            rank = np.random.randint(1, 6)  # Rating from 1-5
            price = np.random.randint(10, 50)
            ingredients = ingredients_templates[category]
            
            # Create skin type compatibility (1 = suitable, 0 = not suitable)
            oily = np.random.choice([0, 1])
            dry = np.random.choice([0, 1])
            combination = np.random.choice([0, 1])
            normal = 1  # Always suitable for normal skin
            sensitive = np.random.choice([0, 1])
            
            # If no skin type is suitable, make it suitable for at least one
            if oily + dry + combination + sensitive == 0:
                oily = 1
            
            data.append({
                'Label': category,
                'brand': brand,
                'name': name,
                'rank': rank,
                'Price': price,
                'ingredients': ingredients,
                'Oily': oily,
                'Dry': dry,
                'Combination': combination,
                'Normal': normal,
                'Sensitive': sensitive
            })
        
        self.df = pd.DataFrame(data)
        print("Created dummy skincare products dataset for testing")
    
    def get_recommendations(self, user_prefs: Dict, user_feedback: List[Dict] = None, user_history: List[Dict] = None) -> List[Dict]:
        """Generate product recommendations based on user preferences and feedback history."""
        recommendations = []
        
        # Apply filters
        filtered_df = self.df.copy()
        
        # Filter by categories if specified
        if user_prefs.get('preferred_categories'):
            filtered_df = filtered_df[filtered_df['Label'].isin(user_prefs['preferred_categories'])]
        
        # Filter by skin type
        skin_type = user_prefs.get('skin_type', 'Normal')
        filtered_df = filtered_df[filtered_df[skin_type] == 1]
        
        # Create a set of products the user has already liked or disliked
        feedback_product_ids = set()
        liked_products = set()
        disliked_products = set()
        
        if user_feedback:
            for fb in user_feedback:
                product_id = fb.get('product_id')
                if product_id:
                    feedback_product_ids.add(product_id)
                    if fb.get('liked') is True:
                        liked_products.add(product_id)
                    elif fb.get('liked') is False:
                        disliked_products.add(product_id)
        
        # Create a set of ingredients from products the user liked
        liked_ingredients = set()
        if liked_products:
            for product_id in liked_products:
                # Find the product in the dataframe
                product_row = filtered_df[filtered_df.index.astype(str) == str(product_id)]
                if not product_row.empty:
                    # Extract ingredients and add them to the set
                    ingredients_text = product_row.iloc[0]['ingredients']
                    # Simple naive approach: split by commas
                    ingredients = [ing.strip() for ing in ingredients_text.split(',')]
                    liked_ingredients.update(ingredients)
        
        for idx, product in filtered_df.iterrows():
            product_id = str(idx)
            
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
            
            # Score from basic algorithm
            base_score = product['rank'] * 2 + preferred_match * 1.5 + concern_match * 2
            
            # Personalization score based on user feedback
            personalization_score = 0
            
            # Boost score for products with ingredients similar to ones the user liked
            if liked_ingredients:
                product_ingredients = [ing.strip() for ing in product['ingredients'].split(',')]
                common_ingredients = set(product_ingredients).intersection(liked_ingredients)
                personalization_score += len(common_ingredients) * 2
            
            # Penalize if user has disliked this type of product
            product_category = product['Label']
            for disliked_id in disliked_products:
                disliked_product = filtered_df[filtered_df.index.astype(str) == str(disliked_id)]
                if not disliked_product.empty and disliked_product.iloc[0]['Label'] == product_category:
                    personalization_score -= 3
                    break
            
            # Use history to slightly boost products in categories user has viewed
            if user_history:
                viewed_categories = {item.get('category') for item in user_history if item.get('category')}
                if product_category in viewed_categories:
                    personalization_score += 1
            
            # Apply the personalization score with a weight factor
            personalization_weight = 0.3  # Adjust to control how much personalization affects recommendations
            total_score = base_score + (personalization_score * personalization_weight)
            
            recommendations.append({
                'id': product_id,
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