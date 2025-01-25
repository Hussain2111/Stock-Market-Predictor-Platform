from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas
from .database import engine, get_db
import yfinance as yf

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173/"],  # Your React app's URL
    allow_credentials=True,
    allow_methods=[""],
    allow_headers=[""],
)

@app.get("/")
def read_root():
    return {"message": "Stock Market Prediction API"}

@app.get("/stock/{symbol}")
def get_stock_data(symbol: str):
    try:
        stock = yf.Ticker(symbol)
        info = stock.info
        return {
            "symbol": symbol,
            "name": info.get("longName"),
            "price": info.get("currentPrice"),
            "change": info.get("regularMarketChangePercent"),
            "marketCap": info.get("marketCap"),
            "volume": info.get("volume")
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found")

@app.get("/predict/{symbol}")
def predict_stock(symbol: str):
    # Here you'll integrate your ML model
    # For now, returning dummy data
    return {
        "symbol": symbol,
        "prediction": {
            "1day": 150.25,
            "7day": 152.50,
            "30day": 155.75
        },
        "confidence": 0.85
    }