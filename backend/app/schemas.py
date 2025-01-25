from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PredictionBase(BaseModel):
    symbol: str
    predicted_price: float
    confidence: float
    prediction_horizon: str

class PredictionCreate(PredictionBase):
    pass

class Prediction(PredictionBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True 