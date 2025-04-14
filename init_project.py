#!/usr/bin/env python3
import os
import shutil
import sys

def init_project():
    """Initialize the project by creating required directories and copying data files."""
    print("Initializing SmartSkin project...")
    
    # Get the project root directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(script_dir, 'backend')
    
    # Create data directory if it doesn't exist
    data_dir = os.path.join(backend_dir, 'data')
    os.makedirs(data_dir, exist_ok=True)
    print(f"✓ Created data directory: {data_dir}")
    
    # Create models/trained directory if it doesn't exist
    model_dir = os.path.join(backend_dir, 'models', 'trained')
    os.makedirs(model_dir, exist_ok=True)
    print(f"✓ Created models directory: {model_dir}")
    
    # Copy CSV file if it exists
    source_csv = os.path.join(script_dir, '..', 'cosmetic_p.csv')
    target_csv = os.path.join(data_dir, 'cosmetic_p.csv')
    
    if os.path.exists(source_csv):
        shutil.copy(source_csv, target_csv)
        print(f"✓ Copied cosmetic_p.csv to {target_csv}")
    else:
        print(f"⚠ Warning: cosmetic_p.csv not found at {source_csv}")
        print("  Please manually place cosmetic_p.csv in the backend/data directory.")
    
    # Check for model files
    model_files = [
        'model_comb.pkl',
        'model_dry.pkl',
        'model_norm.pkl',
        'model_oily.pkl',
        'model_sens.pkl',
        'tfidf_vectorizer.pkl'
    ]
    
    # Check for model files in the root directory
    missing_models = []
    copied_models = []
    
    for model in model_files:
        source_model = os.path.join(script_dir, '..', model)
        target_model = os.path.join(model_dir, model)
        
        if os.path.exists(source_model):
            shutil.copy(source_model, target_model)
            copied_models.append(model)
        else:
            missing_models.append(model)
    
    if copied_models:
        print(f"✓ Copied models: {', '.join(copied_models)}")
    
    if missing_models:
        print(f"⚠ Warning: The following models were not found and need to be manually added to {model_dir}:")
        for model in missing_models:
            print(f"  - {model}")
    
    print("\nInitialization Complete!")
    print(f"\nNext steps:")
    print(f"1. Install backend dependencies: cd backend && pip install -r requirements.txt")
    print(f"2. Install frontend dependencies: cd frontend && npm install")
    print(f"3. Run the backend server: cd backend && python app.py")
    print(f"4. Run the frontend development server (in a separate terminal): cd frontend && npm start")

if __name__ == "__main__":
    init_project() 