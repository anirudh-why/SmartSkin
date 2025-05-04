from pymongo import MongoClient
import bcrypt
import jwt
from datetime import datetime, timedelta
import os
import secrets

class User:
    def __init__(self):
        # Connect to MongoDB directly
        self.client = MongoClient("mongodb+srv://anirudhwhy:Anirudh123@cluster0.7njg8ao.mongodb.net/smartskin")
        self.db = self.client.smartskin
        self.users = self.db.users
        self.secret_key = "your-secret-key"  # Hardcoded JWT secret key for now

    def register(self, email, password, name):
        # Check if user already exists
        if self.users.find_one({"email": email}):
            return {"error": "User already exists"}, 400

        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Create user document
        user = {
            "email": email,
            "password": hashed_password,
            "name": name,
            "created_at": datetime.utcnow(),
            "routines": [],
            "preferences": {
                "skin_type": "",
                "skin_concerns": []
            },
            "feedback": [],
            "product_history": []
        }

        # Insert user into database
        self.users.insert_one(user)

        # Generate JWT token
        token = self.generate_token(email)
        return {"message": "User registered successfully", "token": token}, 201

    def login(self, email, password):
        # Find user
        user = self.users.find_one({"email": email})
        if not user:
            # For security, use the same error message for both cases
            # to avoid leaking information about existing users
            return {"error": "Invalid email or password"}, 401

        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return {"error": "Invalid email or password"}, 401

        # Generate JWT token
        token = self.generate_token(email)
        return {"message": "Login successful", "token": token}, 200

    def generate_token(self, email):
        # Create payload
        payload = {
            "email": email,
            "exp": datetime.utcnow() + timedelta(days=1)
        }
        # Generate token
        token = jwt.encode(payload, self.secret_key, algorithm="HS256")
        return token

    def verify_token(self, token):
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            return {"error": "Token expired"}, 401
        except jwt.InvalidTokenError:
            return {"error": "Invalid token"}, 401

    def get_user_profile(self, email):
        """Get user profile data without exposing sensitive fields."""
        user = self.users.find_one({"email": email})
        if not user:
            return {"error": "User not found"}, 404
            
        # Remove sensitive data
        if '_id' in user:
            user['_id'] = str(user['_id'])
        if 'password' in user:
            del user['password']
            
        return user, 200
        
    def save_routine(self, email, routine_data):
        """Save user's skincare routine."""
        routine = {
            "id": datetime.utcnow().strftime("%Y%m%d%H%M%S"),
            "created_at": datetime.utcnow(),
            "name": routine_data.get("name", "My Routine"),
            "products": routine_data.get("products", []),
            "steps": routine_data.get("steps", [])
        }
        
        result = self.users.update_one(
            {"email": email},
            {"$push": {"routines": routine}}
        )
        
        if result.modified_count == 0:
            return {"error": "Failed to save routine"}, 400
        
        return {"message": "Routine saved successfully", "routine_id": routine["id"]}, 201
        
    def get_routines(self, email):
        """Get all routines for a user."""
        user = self.users.find_one(
            {"email": email},
            {"routines": 1, "_id": 0}
        )
        
        if not user:
            return {"error": "User not found"}, 404
        
        return {"routines": user.get("routines", [])}, 200
        
    def update_preferences(self, email, preferences):
        """Update user preferences."""
        result = self.users.update_one(
            {"email": email},
            {"$set": {"preferences": preferences}}
        )
        
        if result.modified_count == 0:
            return {"error": "Failed to update preferences"}, 400
        
        return {"message": "Preferences updated successfully"}, 200

    def generate_reset_token(self, email):
        """Generate a password reset token and save it to the user's document."""
        user = self.users.find_one({"email": email})
        if not user:
            # Return success even if user doesn't exist for security reasons
            return {"message": "If an account with that email exists, a password reset link has been sent."}, 200
        
        # Generate a secure random token
        reset_token = secrets.token_urlsafe(32)
        reset_token_expires = datetime.utcnow() + timedelta(hours=1)
        
        # Save the token to the user document
        self.users.update_one(
            {"email": email},
            {"$set": {
                "reset_token": reset_token,
                "reset_token_expires": reset_token_expires
            }}
        )
        
        return {
            "message": "Password reset link has been sent.",
            "token": reset_token   # In production, this would be sent via email
        }, 200
    
    def verify_reset_token(self, token):
        """Verify if the reset token is valid and not expired."""
        user = self.users.find_one({
            "reset_token": token,
            "reset_token_expires": {"$gt": datetime.utcnow()}
        })
        
        if not user:
            return {"error": "Invalid or expired reset token"}, 400
        
        return {"valid": True, "email": user["email"]}, 200
    
    def reset_password(self, token, new_password):
        """Reset the user's password using a valid reset token."""
        # Verify token first
        token_result, status_code = self.verify_reset_token(token)
        if status_code != 200:
            return token_result, status_code
        
        # Hash the new password
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        
        # Update user's password and remove reset token fields
        result = self.users.update_one(
            {"reset_token": token},
            {
                "$set": {"password": hashed_password},
                "$unset": {"reset_token": "", "reset_token_expires": ""}
            }
        )
        
        if result.modified_count == 0:
            return {"error": "Failed to reset password"}, 400
        
        return {"message": "Password has been reset successfully"}, 200

    def save_product_feedback(self, email, feedback_data):
        """Save user feedback on a product recommendation."""
        feedback = {
            "product_id": feedback_data.get("product_id"),
            "product_name": feedback_data.get("product_name"),
            "rating": feedback_data.get("rating"),  # 1-5 scale
            "review": feedback_data.get("review", ""),
            "liked": feedback_data.get("liked", None),  # boolean or null
            "used": feedback_data.get("used", False),  # boolean
            "created_at": datetime.utcnow()
        }
        
        # Check if feedback for this product already exists
        existing_feedback = self.users.find_one(
            {
                "email": email,
                "feedback.product_id": feedback["product_id"]
            }
        )
        
        if existing_feedback:
            # Update existing feedback
            result = self.users.update_one(
                {
                    "email": email,
                    "feedback.product_id": feedback["product_id"]
                },
                {"$set": {"feedback.$": feedback}}
            )
        else:
            # Add new feedback
            result = self.users.update_one(
                {"email": email},
                {"$push": {"feedback": feedback}}
            )
        
        if result.modified_count == 0:
            return {"error": "Failed to save feedback"}, 400
        
        # Update product history regardless of feedback existence
        self._update_product_history(email, feedback_data)
        
        return {"message": "Feedback saved successfully"}, 200
    
    def _update_product_history(self, email, product_data):
        """Update user's product history for improved recommendations."""
        product_entry = {
            "product_id": product_data.get("product_id"),
            "product_name": product_data.get("product_name"),
            "category": product_data.get("category", ""),
            "last_viewed": datetime.utcnow()
        }
        
        # Check if product is already in history
        existing_product = self.users.find_one(
            {
                "email": email,
                "product_history.product_id": product_entry["product_id"]
            }
        )
        
        if existing_product:
            # Update existing product in history
            self.users.update_one(
                {
                    "email": email,
                    "product_history.product_id": product_entry["product_id"]
                },
                {"$set": {"product_history.$.last_viewed": product_entry["last_viewed"]}}
            )
        else:
            # Add product to history
            self.users.update_one(
                {"email": email},
                {"$push": {"product_history": product_entry}}
            )
    
    def get_product_history(self, email, limit=20):
        """Get the user's product viewing history."""
        user = self.users.find_one(
            {"email": email},
            {"product_history": 1, "_id": 0}
        )
        
        if not user or "product_history" not in user:
            return {"product_history": []}, 200
        
        # Sort by last_viewed (most recent first) and limit the results
        sorted_history = sorted(
            user.get("product_history", []),
            key=lambda x: x.get("last_viewed", datetime.min),
            reverse=True
        )[:limit]
        
        return {"product_history": sorted_history}, 200
    
    def get_user_feedback(self, email):
        """Get all feedback provided by the user."""
        user = self.users.find_one(
            {"email": email},
            {"feedback": 1, "_id": 0}
        )
        
        if not user:
            return {"error": "User not found"}, 404
        
        return {"feedback": user.get("feedback", [])}, 200 