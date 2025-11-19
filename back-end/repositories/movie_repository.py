from models.movie import Movie
from sqlalchemy.orm import Session
from typing import List, Tuple

class MovieRepository:
    def __init__(self, db:Session):
        self.db = db
    
    def get_all_movies(self, sort_by: str | None = None, order: str = "asc") -> List[Movie]:
        query = self.db.query(Movie)
        if not sort_by:
            return self.db.query(Movie).order_by(Movie.movieId).all()
        
        by = getattr(Movie, sort_by)
        if order == "desc":
            by = by.desc()
        return query.order_by(by).all()
    
    def get_movie_by_title(self, title: str) -> Movie:
        return self.db.query(Movie).filter(Movie.title == title).first()
    
    def get_titles(self, query: str) -> List[Tuple[int, str]]:
        return (
            self.db.query(Movie.movieId, Movie.title)
            .filter(Movie.title.ilike(f"%{query}%"))
            .limit(15)
            .all()
            )