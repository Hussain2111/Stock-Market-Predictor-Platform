# Import necessary libraries
import ollama  # Used to interact with the language model for predictions
import numpy as np  # For numerical computations and random number generation
from datetime import datetime, timedelta  # For working with dates and times
import json  # For parsing JSON data

# Define a class for stock market prediction using a language model
class StockLLMPredictor:
    def __init__(self, model="llama2"):
        """
        Initialize the predictor with a specified model.
        Default model is set to 'llama2'.
        """
        self.model = model

    def predict_stock_movement(self, stock_symbol, days):
        """
        Get stock prediction from the language model (LLM) for the given stock and number of days.
        
        Args:
            stock_symbol (str): The stock ticker symbol to predict.
            days (int): Number of days for the prediction.
        
        Returns:
            dict: A dictionary with predicted movement, confidence, and reasoning.
        """
        # Define the prompt for the language model
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
            # Get response from the LLM using the prompt
            response = ollama.chat(
                model=self.model,
                messages=[{'role': 'user', 'content': prompt}]
            )

            # Extract the content of the response
            content = response['message']['content'].strip()
            if content.startswith("```json"):
                content = content[7:-3]  # Remove ```json and ``` if present
            
            # Ensure only the JSON object is parsed
            content = content[content.find("{"):content.rfind("}")+1]
            
            # Parse the JSON response into a Python dictionary
            prediction_data = json.loads(content)
            
            # Validate and process the predicted price movement
            movement_str = prediction_data['predicted_price_movement']
            if not movement_str.endswith('%'):
                raise ValueError("Price movement must end with %")
            movement = float(movement_str.rstrip('%')) / 100  # Convert percentage to a decimal
            
            # Validate the confidence level
            confidence = prediction_data['confidence_level']
            if not (0 <= confidence <= 1):
                raise ValueError("Confidence must be between 0 and 1")

            # Return the processed prediction data
            return {
                'movement': movement,
                'confidence': confidence,
                'reasoning': prediction_data['reasoning']
            }
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            # Handle errors in parsing or invalid data
            print(f"Error parsing LLM response: {e}")
            print(f"Raw response: {content}")
            # Return default values in case of errors
            return {
                'movement': 0,
                'confidence': 0.5,
                'reasoning': "Unable to generate precise prediction at this time."
            }

    def get_price_predictions(self, stock_symbol, current_price, days):
        """
        Generate future price predictions using the insights from the LLM.
        
        Args:
            stock_symbol (str): The stock ticker symbol to predict.
            current_price (float): The current price of the stock.
            days (int): Number of days for the prediction.
        
        Returns:
            tuple: A tuple containing dates, predicted prices, and reasoning.
        """
        # Get the LLM's prediction for the stock
        prediction = self.predict_stock_movement(stock_symbol, days)
        
        # Determine the time intervals for the prediction
        if days == 1:
            # If predicting for 1 day, use hourly intervals
            dates = [datetime.now() + timedelta(hours=x) for x in range(24)]
        else:
            # For multiple days, use daily intervals
            dates = [datetime.now() + timedelta(days=x) for x in range(days)]
        
        # Calculate the trend and volatility based on the prediction
        trend = prediction['movement'] / (24 if days == 1 else days)  # Adjust trend for hourly/daily intervals
        confidence = prediction['confidence']
        volatility = 0.02 * (1 - confidence)  # Lower confidence results in higher volatility
        
        # Generate predicted prices based on the trend and random noise
        prices = []
        current = current_price
        for _ in range(len(dates)):
            noise = np.random.normal(0, volatility)  # Add random noise for variability
            current *= (1 + trend + noise)  # Update price with trend and noise
            prices.append(current)
        
        # Return the dates, predicted prices, and reasoning for the prediction
        return dates, prices, prediction['reasoning']