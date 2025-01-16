import ollama
import numpy as np
from datetime import datetime, timedelta

class StockLLMPredictor:
    def __init__(self, model="llama3.2"):
        self.model = model

    def predict_stock_movement(self, stock_symbol, days):
        """
        Get stock prediction from LLM for specified number of days
        """
        prompt = f"""
        As a stock market expert, analyze the future movement of {stock_symbol} stock for the next {days} days.
        Provide the following in your response:
        1. Predicted price movement (percentage change)
        2. Confidence level (0-1)
        3. Brief reasoning
        Format: JSON only
        """

        response = ollama.chat(
            model=self.model,
            messages=[{'role': 'user', 'content': prompt}]
        )

        # Process response and return prediction data
        # Note: You'll need to parse the JSON response and extract relevant information
        return {
            'movement': 0.02,  # Example: 2% increase
            'confidence': 0.75,
            'reasoning': response['message']['content']
        }

