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

def get_predictions(db: Session, symbol: str, skip: int = 0, limit: int = 100):
    return db.query(models.Prediction)\
             .filter(models.Prediction.symbol == symbol)\
             .offset(skip)\
             .limit(limit)\
             .all()

def get_latest_prediction(db: Session, symbol: str, horizon: str):
    return db.query(models.Prediction)\
             .filter(models.Prediction.symbol == symbol,
                    models.Prediction.prediction_horizon == horizon)\
             .order_by(models.Prediction.timestamp.desc())\
             .first() 