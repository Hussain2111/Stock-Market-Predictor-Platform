from newsdataapi import NewsDataApiClient
import ollama
import yfinance as yf

MODEL = "deepseek-r1:7b"

api = NewsDataApiClient(apikey='PUT API KEY HERE')
STOCK = "Starbucks"
ticker = yf.Ticker('SBUX')