from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for development

@app.route('/stock-price', methods=['GET'])
def get_stock_price():
    try:
        # Placeholder value for testing
        current_price = 150.25
        
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
    app.run(host='0.0.0.0', debug=True, port=5001)  # Changed port to 5001