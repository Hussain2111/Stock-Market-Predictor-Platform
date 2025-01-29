from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
import subprocess
import sys
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for development

@app.route('/analyze-stock', methods=['POST'])
def analyze_stock():
    try:
        data = request.get_json()
        ticker = data.get('ticker')
        
        print(f"Received request for ticker: {ticker}")  # Debug log
        
        if not ticker:
            return jsonify({
                'error': 'No ticker provided',
                'success': False
            }), 400
            
        script_path = os.path.join(os.path.dirname(__file__), 'lstm_files', 'lstm_yfinance.py')
        
        print(f"Running analysis for {ticker}")  # Debug log
        print(f"Using script at: {script_path}")  # Debug log
        
        process = subprocess.Popen(
            [sys.executable, script_path, ticker],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        stdout, stderr = process.communicate()
        
        print("Analysis output:")  # Debug log
        print(stdout)
        
        if stderr:
            print("Analysis errors:")  # Debug log
            print(stderr)
        
        if process.returncode != 0:
            return jsonify({
                'error': f'Analysis failed: {stderr}',
                'success': False
            }), 500
            
        return jsonify({
            'message': f'Analysis completed for {ticker}',
            'output': stdout,
            'success': True
        })
        
    except Exception as e:
        print(f"Error during analysis: {str(e)}")  # Debug log
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/stock-price', methods=['GET'])
def get_stock_price():
    try:
        # Create a Ticker object for AAPL
        aapl = yf.Ticker("AAPL")
        
        # Get the current price using fast info
        current_price = aapl.fast_info['lastPrice']
        
        print(f"Successfully fetched price: {current_price}")  # Debug logging
        
        return jsonify({
            'stock_price': round(current_price, 2),
            'success': True
        })
    except Exception as e:
        print(f"Error fetching stock price: {str(e)}")  # Debug logging
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5001)  # Changed port to 5001