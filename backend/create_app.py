from flask import Flask
from flask_cors import CORS
from app.chatbot_service import ChatbotService

def create_app():
    app = Flask(__name__)
    
    # Update CORS configuration to allow credentials
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173", "http://localhost:3000"],
            "methods": ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # Store global ticker in app config
    app.config['GLOBAL_TICKER'] = None
    
    # Initialise chatbot service
    app.chatbot_service = ChatbotService()
    
    return app 