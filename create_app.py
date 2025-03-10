from flask import Flask
from flask_cors import CORS
from backend.app.chatbot_service import ChatbotService

def create_app():
    app = Flask(__name__)
    
    # Update CORS configuration to be more specific
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173", "http://localhost:3000"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })
    
    # Store global ticker in app config
    app.config['GLOBAL_TICKER'] = None
    
    # Initialize chatbot service
    app.chatbot_service = ChatbotService()
    
    return app 