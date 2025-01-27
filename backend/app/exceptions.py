from fastapi import HTTPException

class StockNotFoundException(HTTPException):
    def __init__(self, symbol: str):
        super().__init__(
            status_code=404,
            detail=f"Stock with symbol {symbol} not found"
        )

class PredictionNotFoundException(HTTPException):
    def __init__(self, symbol: str):
        super().__init__(
            status_code=404,
            detail=f"No predictions found for symbol {symbol}"
        ) 