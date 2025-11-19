from typing import List
from repositories.movie_repository import MovieRepository
from models.movie import Movie
from fastapi import HTTPException

class MovieService:
    def __init__(self, movie_repository: MovieRepository):
        self.movie_repository = movie_repository
        
    def get_all_movies(self, sort_by: str | None = None, order: str = "asc") -> List[Movie]:
        return self.movie_repository.get_all_movies(sort_by, order)
    
    def get_movie_by_title(self, title) -> Movie:
        movies = self.movie_repository.get_movie_by_title(title)
        if not movies:
            raise HTTPException(404, f"The title:{title} was not found!")
        return movies
    
    def get_titles(self, query: str) -> List[dict]:
        movies = self.movie_repository.get_titles(query)
        return [{"id": m[0], "title": m[1]} for m in movies]