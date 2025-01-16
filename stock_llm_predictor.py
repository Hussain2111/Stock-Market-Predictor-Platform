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

    def get_price_predictions(self, stock_symbol, current_price, days):
        """
        Generate price predictions using LLM insights
        """
        prediction = self.predict_stock_movement(stock_symbol, days)
        
        # Generate time series data points
        dates = [datetime.now() + timedelta(days=x) for x in range(days)]
        
        # Use the LLM's prediction to influence the trend
        trend = prediction['movement'] / days
        confidence = prediction['confidence']
        volatility = 0.02 * (1 - confidence)  # Lower confidence = higher volatility
        
        prices = []
        current = current_price
        for _ in range(days):
            noise = np.random.normal(0, volatility)
            current *= (1 + trend + noise)
            prices.append(current)
            
        return dates, prices, prediction['reasoning']