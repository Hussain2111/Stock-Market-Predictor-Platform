from newsdataapi import NewsDataApiClient
import ollama
import yfinance as yf

MODEL = "deepseek-r1:7b"

api = NewsDataApiClient(apikey='PUT API KEY HERE')
STOCK = "Starbucks"
ticker = yf.Ticker('SBUX')

news_data = ""

response = api.latest_api(q='{stock} stock'.format(stock = STOCK))

# get list of news
news = yf.Search("{stock}".format(stock = STOCK), news_count=20).news