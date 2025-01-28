import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models import StockPrediction
from app.crud import create_prediction, get_predictions, get_latest_prediction
from app.schemas import PredictionCreate

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

@pytest.fixture
def db_session():
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

def test_create_prediction(db_session):
    prediction = PredictionCreate(
        symbol="AAPL",
        predicted_price=150.0,
        confidence=0.85,
        prediction_horizon="1day"
    )
    db_prediction = create_prediction(db_session, prediction)
    assert db_prediction.symbol == "AAPL"
    assert db_prediction.predicted_price == 150.0
    assert db_prediction.confidence == 0.85
    assert db_prediction.prediction_horizon == "1day"

def test_get_predictions(db_session):
    predictions = [
        PredictionCreate(symbol="AAPL", predicted_price=150.0, confidence=0.85, prediction_horizon="1day"),
        PredictionCreate(symbol="AAPL", predicted_price=155.0, confidence=0.80, prediction_horizon="7day"),
        PredictionCreate(symbol="GOOGL", predicted_price=2500.0, confidence=0.90, prediction_horizon="1day")
    ]
    
    for pred in predictions:
        create_prediction(db_session, pred)
    
    aapl_predictions = get_predictions(db_session, "AAPL")
    assert len(aapl_predictions) == 2
    assert all(p.symbol == "AAPL" for p in aapl_predictions)

def test_get_latest_prediction(db_session):
    predictions = [
        PredictionCreate(symbol="MSFT", predicted_price=300.0, confidence=0.85, prediction_horizon="1day"),
        PredictionCreate(symbol="MSFT", predicted_price=310.0, confidence=0.82, prediction_horizon="1day")
    ]
    
    for pred in predictions:
        create_prediction(db_session, pred)
    
    latest = get_latest_prediction(db_session, "MSFT", "1day")
    assert latest.predicted_price == 310.0