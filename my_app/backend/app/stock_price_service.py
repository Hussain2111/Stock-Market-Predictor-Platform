from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/stock-price', methods=['GET'])
def get_stock_price():
    try:
        aapl = yf.Ticker("AAPL")
        current_price = aapl.fast_info['lastPrice']
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
    app.run(host='0.0.0.0', debug=True, port=5001) 