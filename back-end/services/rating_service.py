from fastapi import HTTPException
from typing import List, Tuple
from repositories.rating_repository import RatingRepository
from models.dtos.rating_response import RatingResponse
from models.movie import Movie

class RatingService:
    def __init__(self, rating_repository: RatingRepository):
        self.rating_repository = rating_repository
        
    def get_all_ratings_for_user(self, user_id: int,
                                 sort_by: str | None,
                                 order: str = "asc",
                                 trained_users: set[int] | None = None) -> Tuple[List[RatingResponse], bool]:
        result = self.rating_repository.get_all_ratings_for_user(user_id, sort_by, order)
        if not result:
            raise HTTPException(status_code=404, detail=f"User with id:{user_id} does not exist!. Pick an id between 0 and 609")
        return [
            RatingResponse(
                movieId=movie.movieId,
                title=movie.title,
                year=movie.year,
                keywords=movie.keywords,
                rating=rating.rating
            )
            for rating, movie in result
        ]
        
    def get_zeroed_to_raw_mapping(self) -> dict[int, int]:
        return self.rating_repository.get_zeroed_to_raw_mapping()
        
    def get_movies_info(self) -> dict[int, Movie]:
        return self.rating_repository.get_movies_info()
    
    def is_user_trained(self, user_id, trained_users: set[int]) -> bool:
        return user_id in trained_users
    