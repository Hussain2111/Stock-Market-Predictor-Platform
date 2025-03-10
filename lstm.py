from flask import request, jsonify
import subprocess
import sys
import os

def init_lstm_routes(app):
    @app.route('/run-lstm', methods=['POST'])
    def run_lstm():
        try:
            data = request.get_json()
            ticker = data.get('ticker')
            
            if not ticker:
                return jsonify({
                    'error': 'No ticker provided',
                    'success': False
                }), 400
                
            # Update global ticker in app config
            app.config['GLOBAL_TICKER'] = ticker
            
            # Get the absolute path to lstm_files directory
            current_dir = os.path.dirname(os.path.abspath(__file__))
            lstm_script_path = os.path.join(current_dir, 'lstm_files', 'lstm_yfinance.py')
            
            # Remove existing plots if they exist
            price_history_path = os.path.join(current_dir, 'lstm_files', 'price_history.png')
            prediction_path = os.path.join(current_dir, 'lstm_files', 'prediction_plot.png')
            
            for path in [price_history_path, prediction_path]:
                if os.path.exists(path):
                    os.remove(path)
                    print(f"Removed existing plot: {path}")
            
            # Run the LSTM script with the ticker as argument
            process = subprocess.run(
                [sys.executable, lstm_script_path, ticker],
                capture_output=True,
                text=True,
                encoding='utf-8',  # Specify UTF-8 encoding
                check=False
            )
            
            print(f"LSTM Output: {process.stdout}")
            if process.stderr:
                print(f"LSTM Errors: {process.stderr}")
            
            # Check for errors
            if process.returncode != 0:
                return jsonify({
                    'error': f'LSTM analysis failed: {process.stderr}',
                    'success': False
                }), 500
                
            return jsonify({
                'message': f'LSTM analysis completed for {ticker}',
                'output': process.stdout,
                'success': True
            })
            
        except Exception as e:
            print(f"Error in run_lstm: {str(e)}")  # Debug logging
            return jsonify({
                'error': str(e),
                'success': False
            }), 500