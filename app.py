from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
CORS(app)

@app.route('/stock-price', methods=['GET'])
def get_stock_price():
    try:
        # Get AAPL stock info
        ticker = yf.Ticker("AAPL")
        
        # Get the current price (last closing price)
        current_price = ticker.info['regularMarketPrice']
        
        return jsonify({
            'stock_price': round(current_price, 2),
            'success': True
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)