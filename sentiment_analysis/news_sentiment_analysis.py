from newsdataapi import NewsDataApiClient
import ollama
import yfinance as yf

MODEL = "deepseek-r1:7b"

api = NewsDataApiClient(apikey='PUT API KEY HERE')
STOCK = "Starbucks"
ticker = yf.Ticker('SBUX')

news_data = ""

# Get the news response from newsdata api
response = api.latest_api(q='{stock} stock'.format(stock = STOCK))

# get list of news
news = yf.Search("{stock}".format(stock = STOCK), news_count=20).news

# Extract individual descriptions
for article in response["results"]:
        article_description = article.get('description')
        if isinstance(article_description, str):
            news_data += article.get('description')

