from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./stock_predictions.db"
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Stock Market Prediction"

    class Config:
        env_file = ".env"

settings = Settings() 