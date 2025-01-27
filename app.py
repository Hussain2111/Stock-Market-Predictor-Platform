from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/stock-price', methods=['GET'])
def get_stock_price():
    # Example stock price to simulate dynamic data
    stock_price = 9999
    return jsonify({'stock_price': stock_price})

if __name__ == '__main__':
    app.run(debug=True, port=5000)