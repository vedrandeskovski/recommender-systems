from pydantic import BaseModel

class MovieResponse(BaseModel):
    movieId: int
    title: str
    year: int | None
    keywords: str
    
    class Config:
        from_attributes = True
        
class TitleResponse(BaseModel):
    title: str
    id: int