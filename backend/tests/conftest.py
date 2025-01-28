import os
import sys
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import Base
from app.models import StockPrediction

@pytest.fixture(scope="session")
def engine():
    SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
    return create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

@pytest.fixture(scope="session")
def tables(engine):
    Base.metadata.create_all(engine)
    yield
    Base.metadata.drop_all(engine)

@pytest.fixture
def db_session(engine, tables):
    connection = engine.connect()
    transaction = connection.begin()
    Session = sessionmaker(bind=connection)
    session = Session()

    yield session

    session.close()
    transaction.rollback()
    connection.close()