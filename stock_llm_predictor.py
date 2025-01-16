import ollama
import numpy as np
from datetime import datetime, timedelta
import json

class StockLLMPredictor:
    def __init__(self, model="llama2"):
        self.model = model

    def predict_stock_movement(self, stock_symbol, days):
        """
        Get stock prediction from LLM for specified number of days
        """
        prompt = f"""
        As a stock market expert, analyze the future movement of {stock_symbol} stock for the next {days} days.
        Provide your response in this exact JSON format:
        {{
            "predicted_price_movement": "(number with % sign)",
            "confidence_level": (number between 0-1),
            "reasoning": "your brief analysis"
        }}
        Only respond with valid JSON, no other text.
        """

        response = ollama.chat(
            model=self.model,
            messages=[{'role': 'user', 'content': prompt}]
        )

        try:
            # Try to extract JSON from the response
            content = response['message']['content']
            # Clean the content string to ensure it's valid JSON
            content = content.strip()
            if content.startswith("```json"):
                content = content[7:-3]  # Remove ```json and ``` if present
            prediction_data = json.loads(content)
            
            # Convert percentage string to float
            movement_str = prediction_data['predicted_price_movement']
            movement = float(movement_str.strip('%')) / 100  # Convert "5%" to 0.05
            
            return {
                'movement': movement,
                'confidence': prediction_data['confidence_level'],
                'reasoning': prediction_data['reasoning']
            }
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            print(f"Error parsing LLM response: {e}")
            # Return default values if parsing fails
            return {
                'movement': 0,
                'confidence': 0.5,
                'reasoning': response['message']['content']
            }

    def get_price_predictions(self, stock_symbol, current_price, days):
        """
        Generate price predictions using LLM insights
        """
        prediction = self.predict_stock_movement(stock_symbol, days)
        
        # Generate time series data points with proper time intervals
        if days == 1:
            # For 1-day prediction, use hourly intervals
            dates = [datetime.now() + timedelta(hours=x) for x in range(24)]
            days = 1
        else:
            # For multiple days, use daily intervals
            dates = [datetime.now() + timedelta(days=x) for x in range(days)]
        
        # Use the LLM's prediction to influence the trend
        trend = prediction['movement'] / (24 if days == 1 else days)  # Adjust trend for hourly vs daily
        confidence = prediction['confidence']
        volatility = 0.02 * (1 - confidence)  # Lower confidence = higher volatility
        
        prices = []
        current = current_price
        for _ in range(len(dates)):  # Use len(dates) instead of days to match the number of intervals
            noise = np.random.normal(0, volatility)
            current *= (1 + trend + noise)
            prices.append(current)
            
        return dates, prices, prediction['reasoning']