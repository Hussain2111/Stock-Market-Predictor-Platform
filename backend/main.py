from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, crud
from .database import engine, get_db
import yfinance as yf

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

@app.post("/predictions/", response_model=schemas.Prediction)
def create_prediction(prediction: schemas.PredictionCreate, db: Session = Depends(get_db)):
    return crud.create_prediction(db=db, prediction=prediction)

@app.get("/predictions/{symbol}", response_model=List[schemas.Prediction])
def read_predictions(symbol: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    predictions = crud.get_predictions(db, symbol=symbol, skip=skip, limit=limit)
    return predictions

@app.get("/predictions/{symbol}/latest/{horizon}", response_model=schemas.Prediction)
def read_latest_prediction(symbol: str, horizon: str, db: Session = Depends(get_db)):
    prediction = crud.get_latest_prediction(db, symbol=symbol, horizon=horizon)
    if prediction is None:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return prediction