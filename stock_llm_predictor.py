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
        You must respond with ONLY a JSON object in this exact format, with no additional text:
        {{
            "predicted_price_movement": "X%",
            "confidence_level": 0.Y,
            "reasoning": "your brief analysis"
        }}
        
        Rules:
        1. predicted_price_movement must be a single number with % sign (e.g. "5%" or "-3%")
        2. confidence_level must be a number between 0 and 1
        3. Do not include ranges or multiple numbers
        4. Do not include any text outside the JSON object
        """

        try:
            response = ollama.chat(
                model=self.model,
                messages=[{'role': 'user', 'content': prompt}]
            )

            content = response['message']['content']
            # Clean the content string to ensure it's valid JSON
            content = content.strip()
            if content.startswith("```json"):
                content = content[7:-3]  # Remove ```json and ``` if present
            
            # Remove any text before or after the JSON object
            content = content[content.find("{"):content.rfind("}")+1]
            
            prediction_data = json.loads(content)
            
            # Validate the prediction format
            movement_str = prediction_data['predicted_price_movement']
            if not movement_str.endswith('%'):
                raise ValueError("Price movement must end with %")
            
            # Convert percentage string to float, handling negative numbers
            movement = float(movement_str.rstrip('%')) / 100
            
            confidence = prediction_data['confidence_level']
            if not (0 <= confidence <= 1):
                raise ValueError("Confidence must be between 0 and 1")

            return {
                'movement': movement,
                'confidence': confidence,
                'reasoning': prediction_data['reasoning']
            }
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            print(f"Error parsing LLM response: {e}")
            print(f"Raw response: {content}")
            # Return conservative default values if parsing fails
            return {
                'movement': 0,
                'confidence': 0.5,
                'reasoning': "Unable to generate precise prediction at this time."
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