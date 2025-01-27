from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for development

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