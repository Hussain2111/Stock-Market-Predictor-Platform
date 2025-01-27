from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime

def create_prediction(db: Session, prediction: schemas.PredictionCreate):
    db_prediction = models.Prediction(
        symbol=prediction.symbol,
        predicted_price=prediction.predicted_price,
        confidence=prediction.confidence,
        prediction_horizon=prediction.prediction_horizon
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return db_prediction

