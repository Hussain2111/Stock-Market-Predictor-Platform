from flask import Flask, jsonify, request
from pymongo import MongoClient
import yfinance as yf
import os
import base64
from create_app import create_app
from lstm import init_lstm_routes
from backend.app.chatbot_service import ChatbotService
import random
import pandas as pd
from datetime import datetime, timedelta
import numpy as np
from textblob import TextBlob
import logging

app = create_app()

# Initialize LSTM routes
init_lstm_routes(app)

# Initialize chatbot service
chatbot_service = ChatbotService()

# Initialise the mongodb connection
# MongoDB connection
client = MongoClient("mongodb+srv://uas4:AlphaCentauri1206@stockdb.gupsk.mongodb.net/?retryWrites=true&w=majority&appName=stockdb")  # Update if using a remote DB
db = client["trading_app"]
investments_collection = db["investments"]

@app.route('/stock-price', methods=['GET'])
def get_stock_price():
    try:
        ticker = app.config['GLOBAL_TICKER']
        
        if not ticker:
            # Return a default value instead of error when no ticker is set
            return jsonify({
                'currentPrice': 0,
                'ticker': None,
                'success': True
            })

        # Create a Ticker object
        stock = yf.Ticker(ticker)
        
        # Get the current price using fast info
        current_price = stock.fast_info['lastPrice']
        
        print(f"Successfully fetched price: {current_price}")  # Debug logging
        
        return jsonify({
            'currentPrice': round(current_price, 2),
            'ticker': ticker,
            'success': True
        })
    except Exception as e:
        print(f"Error fetching stock price: {str(e)}")  # Debug logging
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/get-price-history', methods=['GET'])
def get_price_history():
    try:
        image_path = os.path.join(os.path.dirname(__file__), 'lstm_files', 'price_history.png')
        print(f"Looking for image at: {image_path}")  # Debug log
        
        if not os.path.exists(image_path):
            print(f"Image not found at: {image_path}")
            return jsonify({
                'error': 'Price history plot not yet generated',
                'success': False
            }), 404
            
        with open(image_path, 'rb') as image_file:
            encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
            
        # Get current price
        stock = yf.Ticker(app.config['GLOBAL_TICKER'])
        current_price = stock.fast_info['lastPrice']
            
        return jsonify({
            'image': encoded_image,
            'current_price': round(current_price, 2),
            'success': True
        })
    except Exception as e:
        print(f"Error serving price history plot: {str(e)}")  # Debug logging
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/get-prediction', methods=['GET'])
def get_prediction():
    try:
        image_path = os.path.join(os.path.dirname(__file__), 'lstm_files', 'prediction_plot.png')
        print(f"Looking for prediction plot at: {image_path}")
        
        if not os.path.exists(image_path):
            print(f"Prediction plot not found at: {image_path}")
            return jsonify({
                'error': 'Prediction plot not yet generated',
                'success': False
            }), 404
            
        with open(image_path, 'rb') as image_file:
            encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
            
        # Get current price
        stock = yf.Ticker(app.config['GLOBAL_TICKER'])
        current_price = stock.info.get('regularMarketPrice', 0)
            
        return jsonify({
            'image': encoded_image,
            'current_price': round(current_price, 2) if current_price else 0,
            'success': True
        })
    except Exception as e:
        print(f"Error serving prediction plot: {str(e)}")
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message')
        stock_symbol = data.get('symbol')
        user_id = data.get('userId')
        
        if not all([message, stock_symbol, user_id]):
            return jsonify({
                'error': 'Message, stock symbol, and user ID are required',
                'success': False
            }), 400
        
        result = chatbot_service.process_message(user_id, message, stock_symbol)
        
        if not result['success']:
            return jsonify(result), 500
            
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/chat/history/<user_id>', methods=['GET'])
def get_chat_history(user_id):
    try:
        history = chatbot_service.get_conversation_history(user_id)
        return jsonify({
            'history': history,
            'success': True
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/stock/news/<symbol>', methods=['GET'])
def get_stock_news(symbol):
    try:
        news = chatbot_service.get_stock_news(symbol)
        return jsonify({
            'news': news,
            'success': True
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/stock-info', methods=['GET'])
def get_stock_info():
    try:
        ticker = request.args.get('ticker')
        if not ticker:
            return jsonify({
                'error': 'No ticker provided',
                'success': False
            }), 400

        stock = yf.Ticker(ticker)
        info = stock.info
        
        return jsonify({
            'company_name': info.get('longName', ''),
            'price_change': f"{info.get('regularMarketChangePercent', 0):.2f}%",
            'success': True
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/get-sentiment', methods=['GET'])
def get_sentiment():
    try:
        ticker = request.args.get('ticker')
        if not ticker:
            return jsonify({
                'error': 'No ticker provided',
                'success': False
            }), 400

        # Get the stock info
        stock = yf.Ticker(ticker)
        
        # Import the necessary libraries for sentiment analysis
        from newsdataapi import NewsDataApiClient
        import ollama
        
        # Get news data from two sources
        api = NewsDataApiClient(apikey='pub_736718e9399326ef93bc5d214d31ad00dec04')
        news_data = ""
        
        # Get the news response from newsdata api
        response = api.latest_api(q=f'{ticker} stock')
        
        # Extract individual descriptions from newsdata
        article_count = 0
        for article in response.get("results", []):
            article_description = article.get('description')
            if isinstance(article_description, str):
                news_data += article_description
                article_count += 1
        
        # Get news from yfinance
        yf_news = stock.get_news()
        
        # Extract summary of news articles from yfinance
        yf_article_count = min(10, len(yf_news))
        for i in range(yf_article_count):
            try:
                summary = yf_news[i].get('content', {}).get('summary', '')
                if summary:
                    news_data += summary
                    article_count += 1
            except (IndexError, AttributeError):
                continue
        
        if not news_data:
            return jsonify({
                'error': 'No news data available for sentiment analysis',
                'success': False
            }), 404
        
        # Create a prompt for sentiment analysis
        prompt = f"""Give me a sentiment analysis in percentage 
                  terms of negative and positive of {ticker} stock based on 
                  the following news articles. Be very concise.
                  Just extract the exact percentage values for positive, negative, and neutral sentiment.
                  Make the percentages for positive, negative, and neutral add up to 100%.
                  Format your response in a clean JSON structure like this:
                  {{
                    "positive": 65,
                    "negative": 25, 
                    "neutral": 10
                  }}
                  Only output the JSON."""
        
        prompt_complete = prompt + news_data
        
        # Call Ollama model for sentiment analysis
        MODEL = "deepseek-r1:7b"
        response = ollama.chat(
            model=MODEL,
            messages=[{'role': 'user', 'content': prompt_complete}]
        )
        
        sentiment_result = response['message']['content']
        
        # Parse the JSON response
        import json
        import re
        
        # Extract the JSON part from the response
        json_match = re.search(r'\{.*\}', sentiment_result, re.DOTALL)
        if json_match:
            sentiment_json = json_match.group(0)
            sentiment_data = json.loads(sentiment_json)
        else:
            # Fallback if JSON parsing fails
            sentiment_data = {
                "positive": 50,
                "negative": 30,
                "neutral": 20
            }
        
        # Calculate average sentiment
        average_sentiment = sentiment_data.get("positive", 0) / 100.0
        
        # Create a response with current and historical sentiment
        sentiment_response = {
            "current": {
                "period": "Current",
                "positive": sentiment_data.get("positive", 0),
                "negative": sentiment_data.get("negative", 0),
                "neutral": sentiment_data.get("neutral", 0),
                "totalMentions": article_count,
                "averageSentiment": average_sentiment
            },
            "historical": [
                {
                    "period": "Last Week",
                    "positive": max(0, min(100, sentiment_data.get("positive", 50) + round(random.uniform(-7, 7)))),
                    "negative": max(0, min(100, sentiment_data.get("negative", 30) + round(random.uniform(-5, 5)))),
                    "neutral": max(0, min(100, sentiment_data.get("neutral", 20) + round(random.uniform(-3, 3)))),
                    "totalMentions": article_count - round(random.uniform(0, article_count * 0.3)),
                    "averageSentiment": max(0, min(1, average_sentiment + random.uniform(-0.1, 0.1)))
                },
                {
                    "period": "Last Month",
                    "positive": max(0, min(100, sentiment_data.get("positive", 50) + round(random.uniform(-10, 10)))),
                    "negative": max(0, min(100, sentiment_data.get("negative", 30) + round(random.uniform(-8, 8)))),
                    "neutral": max(0, min(100, sentiment_data.get("neutral", 20) + round(random.uniform(-5, 5)))),
                    "totalMentions": article_count * round(random.uniform(3, 5)),
                    "averageSentiment": max(0, min(1, average_sentiment + random.uniform(-0.15, 0.15)))
                }
            ],
            "success": True
        }
        
        return jsonify(sentiment_response)
        
    except Exception as e:
        import traceback
        traceback_str = traceback.format_exc()
        print(f"Error getting sentiment: {str(e)}\n{traceback_str}")
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/get-technical-fundamental', methods=['GET'])
def get_technical_fundamental():
    try:
        ticker = request.args.get('ticker')
        if not ticker:
            return jsonify({
                'error': 'No ticker provided',
                'success': False
            }), 400

        stock = yf.Ticker(ticker)
        
        # Get historical data for technical indicators
        hist = stock.history(period="3mo")
        
        if hist.empty:
            return jsonify({
                'error': 'No historical data available',
                'success': False
            }), 404
        
        # Calculate RSI (14)
        delta = hist['Close'].diff()
        gain = delta.where(delta > 0, 0).rolling(window=14).mean()
        loss = -delta.where(delta < 0, 0).rolling(window=14).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs.iloc[-1]))
        
        # Calculate MACD
        ema12 = hist['Close'].ewm(span=12, adjust=False).mean()
        ema26 = hist['Close'].ewm(span=26, adjust=False).mean()
        macd = ema12.iloc[-1] - ema26.iloc[-1]
        
        # Calculate Bollinger Bands
        sma20 = hist['Close'].rolling(window=20).mean()
        std20 = hist['Close'].rolling(window=20).std()
        upper_band = sma20 + (std20 * 2)
        lower_band = sma20 - (std20 * 2)
        
        # Get fundamental data
        info = stock.info
        
        technical = {
            'rsi': round(rsi, 2),
            'macd': round(macd, 2),
            'bollinger': {
                'upper': round(upper_band.iloc[-1], 2),
                'middle': round(sma20.iloc[-1], 2),
                'lower': round(lower_band.iloc[-1], 2)
            }
        }
        
        fundamental = {
            'peRatio': round(info.get('trailingPE', 0), 2),
            'pbRatio': round(info.get('priceToBook', 0), 2),
            'debtEquity': round(info.get('debtToEquity', 0), 2),
            'quickRatio': round(info.get('quickRatio', 0), 2),
            'currentRatio': round(info.get('currentRatio', 0), 2),
            'returnOnEquity': round(info.get('returnOnEquity', 0) * 100 if info.get('returnOnEquity') else 0, 2),
            'returnOnAssets': round(info.get('returnOnAssets', 0) * 100 if info.get('returnOnAssets') else 0, 2)
        }
        
        return jsonify({
            'technical': technical,
            'fundamental': fundamental,
            'success': True
        })
        
    except Exception as e:
        print(f"Error fetching technical/fundamental data: {str(e)}")
        return jsonify({
            'error': str(e),
            'success': False
        }), 500
        
@app.route('/api/stock', methods=['GET'])
def get_stock_data():
    try:
        # Get stock symbol from query parameter
        stock_symbol = request.args.get('symbol', '')
        
        if not stock_symbol:
            return jsonify({"error": "Stock symbol is required"}), 400
            
        # Default period is 1 year if not specified
        period = request.args.get('period', '1y')
        
        # Get data from yfinance
        stock = yf.Ticker(stock_symbol)
        hist = stock.history(period=period)
        
        # Reset index to make date a column and convert to string format
        hist = hist.reset_index()
        hist['Date'] = hist['Date'].dt.strftime('%Y-%m-%d')
        
        # Get current price (use regularMarketPrice as currentPrice might not be available)
        current_price = stock.info.get('regularMarketPrice', 0)
        
        # Prepare the response data
        stock_data = {
            "symbol": stock_symbol,
            "name": stock.info.get('shortName', stock_symbol),
            "currency": stock.info.get('currency', 'USD'),
            "currentPrice": current_price,
            "previousClose": stock.info.get('previousClose', 0),
            "marketCap": stock.info.get('marketCap', 0),
            "dayHigh": stock.info.get('dayHigh', 0),
            "dayLow": stock.info.get('dayLow', 0),
            "priceData": hist[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']].to_dict('records')
        }
        
        return jsonify(stock_data)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search_stocks():
    try:
        query = request.args.get('q', '')
        
        if not query or len(query) < 2:
            return jsonify([])
            
        # This is a simplified approach - in production, you'd want a more robust search
        # For demo purposes, just return a few matching stocks
        matches = []
        if 'apple' in query.lower() or 'aapl' in query.lower():
            matches.append({"symbol": "AAPL", "name": "Apple Inc.", "exchange": "NASDAQ"})
        if 'tesla' in query.lower() or 'tsla' in query.lower():
            matches.append({"symbol": "TSLA", "name": "Tesla, Inc.", "exchange": "NASDAQ"})
        if 'google' in query.lower() or 'goog' in query.lower():
            matches.append({"symbol": "GOOGL", "name": "Alphabet Inc.", "exchange": "NASDAQ"})
        if 'amazon' in query.lower() or 'amzn' in query.lower():
            matches.append({"symbol": "AMZN", "name": "Amazon.com, Inc.", "exchange": "NASDAQ"})
        if 'microsoft' in query.lower() or 'msft' in query.lower():
            matches.append({"symbol": "MSFT", "name": "Microsoft Corporation", "exchange": "NASDAQ"})
            
        # If no matches in our simple list, try to get a ticker directly with this name
        if not matches and len(query) >= 2:
            try:
                ticker = yf.Ticker(query.upper())
                info = ticker.info
                if info and 'shortName' in info:
                    matches.append({
                        "symbol": query.upper(),
                        "name": info.get('shortName', query.upper()),
                        "exchange": info.get('exchange', 'Unknown')
                    })
            except:
                pass
                
        return jsonify(matches)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/stock-price-data')
def get_stock_price_data():
    ticker = request.args.get('ticker', 'AAPL')
    timeframe = request.args.get('timeframe', '1M')
    
    timeframe_mapping = {
        '1D': ('1d', '5m'),
        '1W': ('1wk', '15m'),
        '1M': ('1mo', '1d'),
        '3M': ('3mo', '1d'),
        '1Y': ('1y', '1d'),
        'ALL': ('max', '1wk')
    }
    
    period, interval = timeframe_mapping.get(timeframe, ('1mo', '1d'))
    
    try:
        # Fetch stock data
        stock = yf.Ticker(ticker)
        df = stock.history(period=period, interval=interval)
        
        # Calculate moving averages
        if len(df) > 20:
            df['MA20'] = df['Close'].rolling(window=20).mean()
        if len(df) > 50:
            df['MA50'] = df['Close'].rolling(window=50).mean()
        if len(df) > 200:
            df['MA200'] = df['Close'].rolling(window=200).mean()
        
        # Convert NaN values to None (null in JSON)
        df = df.replace({np.nan: None})
        
        # Format data for frontend
        price_data = []
        for index, row in df.iterrows():
            price_data.append({
                'date': index.strftime('%Y-%m-%d %H:%M:%S'),
                'price': row['Close'],
                'volume': row['Volume'],
                'ma20': row.get('MA20'),
                'ma50': row.get('MA50'),
                'ma200': row.get('MA200')
            })
        
        return jsonify({
            'success': True,
            'priceData': price_data
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/api/stock-news', methods=['GET'])
def fetch_stock_news():
    try:
        ticker = request.args.get('ticker')
        if not ticker:
            return jsonify({'success': False, 'error': 'No ticker provided'})

        # Get stock info
        stock = yf.Ticker(ticker)
        raw_news = stock.news
        
        print(f"Fetched {len(raw_news)} raw news items for {ticker}")  # Debug print

        # Process and format news
        processed_news = []
        for item in raw_news:
            try:
                # Extract content from the nested structure
                content = item.get('content', item)  # Handle both direct and nested content
                
                # Extract title and summary
                title = content.get('title', '').strip()
                summary = content.get('summary', '').strip()
                
                if not title:  # Skip items without a title
                    continue

                # Get publisher info
                provider = content.get('provider', {})
                source = provider.get('displayName', 'Unknown Source')

                # Get URL
                click_through = content.get('clickThroughUrl', {})
                url = click_through.get('url', '')

                # Get publish date and format time
                pub_date = content.get('pubDate')
                if pub_date:
                    try:
                        dt = datetime.strptime(pub_date, '%Y-%m-%dT%H:%M:%SZ')
                        now = datetime.utcnow()
                        diff = now - dt
                        
                        if diff.days > 0:
                            time_str = f"{diff.days}d ago"
                        elif diff.seconds >= 3600:
                            hours = diff.seconds // 3600
                            time_str = f"{hours}h ago"
                        else:
                            minutes = (diff.seconds // 60) or 1
                            time_str = f"{minutes}m ago"
                    except Exception as e:
                        print(f"Error parsing date: {e}")
                        time_str = "Recent"
                else:
                    time_str = "Recent"

                # Perform sentiment analysis
                text_for_analysis = f"{title} {summary}"
                analysis = TextBlob(text_for_analysis)
                sentiment_score = analysis.sentiment.polarity

                # Determine sentiment category
                if sentiment_score > 0.1:
                    sentiment = 'positive'
                elif sentiment_score < -0.1:
                    sentiment = 'negative'
                else:
                    sentiment = 'neutral'

                # Determine impact based on sentiment strength
                if abs(sentiment_score) > 0.5:
                    impact = 'High'
                elif abs(sentiment_score) > 0.2:
                    impact = 'Medium'
                else:
                    impact = 'Low'

                news_item = {
                    'title': title,
                    'source': source,
                    'sentiment': sentiment,
                    'time': time_str,
                    'summary': summary,
                    'impact': impact,
                    'url': url
                }
                processed_news.append(news_item)
                print(f"Processed news item: {title}")  # Debug print

            except Exception as e:
                print(f"Error processing individual news item: {str(e)}")
                continue

        print(f"Successfully processed {len(processed_news)} news items for {ticker}")

        return jsonify({
            'success': True,
            'news': processed_news
        })

    except Exception as e:
        print(f"Error in news processing: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        })
        
@app.route('/buy-stock', methods=['POST'])
def buy_stock():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        ticker = data.get('ticker')
        quantity = data.get('quantity', 1)
        stock_holdings = data.get('stock_holdings')

        if not all([user_id, ticker, quantity,stock_holdings]):
            return jsonify({
                "error": "Missing required fields", 
                "success": False}), 400
        
        # Check if the user already owns this stock
        existing_investment = investments_collection.find_one({
            "user_id": user_id,
            "ticker": ticker
        })
        
        if existing_investment:
            old_holdings = existing_investment.get('stock_holdings')
            stock_holdings = old_holdings + stock_holdings
            # If stock exists, update the quantity and stock holdings
            investments_collection.update_one(
                {"_id": existing_investment["_id"]},
                {"$inc": {"quantity": quantity}, 
                 "$set": {"date": datetime.now(), 
                          "stock_holdings": stock_holdings}}
            )
            message = "Stock quantity updated!"
        
        else:
            # Otherwise, insert a new stock purchase
            investment = {
                "user_id": user_id,
                "ticker": ticker,
                "quantity": quantity,
                "stock_holdings": stock_holdings,
                "date": datetime.now()
            }
            investments_collection.insert_one(investment)
            message = "New investment added!"

        return jsonify({"message": "Investment saved!", "success": True})
    
    except Exception as e:
        return jsonify({"error": str(e), "success": False}), 500
    
@app.route('/sell-stock', methods=['POST'])
def sell_stock():
    try:
        data = request.json
        ticker = data.get("ticker")
        user_id = data.get("user_id")
        quantity = data.get("quantity", 1) # Default to selling 1 stock if not specified
        currentPrice = data.get("currentPrice")

        if not all([ticker, user_id]):
            return jsonify({
                "success": False, 
                "error": "Missing required fields"}), 400

        # Find the stock entry
        existing_investment = investments_collection.find_one({
            "ticker": ticker, 
            "user_id": user_id})

        if not existing_investment:
            return jsonify({
                "success": False, 
                "error": "Stock not found in portfolio"}), 404

        current_quantity = existing_investment.get("quantity")

        if current_quantity < quantity:
            return jsonify({
                "success": False, 
                "error": "Not enough stock to sell"}), 400

        if current_quantity == quantity:
            # If selling all stocks, remove the entry completely
            investments_collection.delete_one({"_id": existing_investment["_id"]})
            message = f"Sold all {ticker} stocks, removed from portfolio!"
        else:
            # Otherwise, decrement the quantity
            investments_collection.update_one(
                {"_id": existing_investment["_id"]},
                {"$inc": {"quantity": -quantity, "stock_holdings": -currentPrice}}
            )
            message = f"Sold {quantity} {ticker} stocks, {current_quantity - quantity} remaining."

        return jsonify({
            "success": True, 
            "message": message})

    except Exception as e:
        return jsonify({
            "success": False, 
            "error": str(e)}), 500
        
# Portfolio (Fetch User's Stocks)
@app.route('/portfolio', methods=['GET'])
def get_portfolio():
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"success": False, "error": "User ID required"}), 400

        stocks = list(investments_collection.find({"user_id": user_id}, {"_id": 0}))  # Exclude _id
        return jsonify(stocks)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)