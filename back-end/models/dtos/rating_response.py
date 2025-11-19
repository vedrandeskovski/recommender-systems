from pydantic import BaseModel
from fastapi_pagination import Page

class RatingResponse(BaseModel):
    movieId: int
    title: str
    year: int | None
    keywords: str
    rating: float
    
    class Config:
        from_attributes = True
        
class UserRatingsResponse(BaseModel):
    in_trained_set: bool
    ratings: list