from flask import jsonify
import ollama
import yfinance as yf
from typing import Dict, List, Optional
from datetime import datetime

class ChatbotService:
    def __init__(self, model_name: str = "llama2"):
        self.model = model_name
        self.context = {}
        
    def get_stock_news(self, symbol: str) -> List[Dict]:
        """Fetch recent news for the stock"""
        try:
            stock = yf.Ticker(symbol)
            news = stock.news
            
            formatted_news = []
            for item in news[:5]:  # Get latest 5 news items
                formatted_news.append({
                    'title': item.get('title'),
                    'publisher': item.get('publisher'),
                    'link': item.get('link'),
                    'published': datetime.fromtimestamp(item.get('providerPublishTime', 0)).strftime('%Y-%m-%d %H:%M:%S')
                })
            return formatted_news
        except Exception as e:
            print(f"Error fetching news for {symbol}: {e}")
            return []

    