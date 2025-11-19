from typing import List, Tuple
from models.rating import Rating
from models.movie import Movie
from sqlalchemy.orm import Session

class RatingRepository:
    def __init__(self, db: Session):
        self.db = db
        self.sort_columns = {
            "rating": Rating.rating,
            "title": Movie.title,
            "year": Movie.year
        }
    
    def get_all_ratings_for_user(self, user_id: int, sort_by: str | None, order: str = "asc") -> List[Tuple[Rating, Movie]]:
        query = (
            self.db.query(Rating, Movie)
            .filter(Rating.zeroed_userId == user_id)
            .join(Movie, Rating.movieId == Movie.movieId)
        )
        if not sort_by:
            return query.order_by(Movie.movieId).all()
        
        by = self.sort_columns.get(sort_by, Movie.movieId)
        if order == "desc":
            by = by.desc()
            
        return query.order_by(by).all()
    
    def get_all_unrated_zeroed_movie_ids_for_user(self, user_id: int) -> List[int]:
        rated_movie_ids = self.db.query(Rating.zeroed_movieId).filter(Rating.zeroed_userId == user_id).all()
        rated_movie_ids = [m[0] for m in rated_movie_ids]
        if not rated_movie_ids:
            return []
        unrated_movie_ids = self.db.query(Rating.zeroed_movieId).filter(~Rating.zeroed_movieId.in_(rated_movie_ids)).distinct().all()
        unrated_movie_ids = [m[0] for m in unrated_movie_ids]
        
        return unrated_movie_ids
    
    def get_zeroed_to_raw_mapping(self) -> dict[int, int]:
        return dict(
            self.db.query(Rating.zeroed_movieId, Rating.movieId).all()
        )
        
    def get_movies_info(self) -> dict[int, Movie]:
        return dict(
            (m.movieId, m) for m in self.db.query(Movie)
            .filter(Movie.movieId.in_(self.get_zeroed_to_raw_mapping().values())).all()
        )