from sqlalchemy import Column, Integer, String, Float, DateTime
from .database import Base
from datetime import datetime

class StockPrediction(Base):
    tablename = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    predicted_price = Column(Float)
    confidence = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    prediction_horizon = Column(String)  # e.g., "1day", "7day", "30day"