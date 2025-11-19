from fastapi import HTTPException
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from repositories.movie_repository import MovieRepository
from typing import List
from models.movie import Movie
from models.dtos.movie_response import MovieResponse

class TFIDFService:
    def __init__(self, movie_repository: MovieRepository):
        self.movie_repository = movie_repository
        self.tfidf_vectorizer = TfidfVectorizer()
        self.sparse_matrix = None
        self.titles = []
        self.movies = []
                
    def fit_transform(self):
        self.movies = self.movie_repository.get_all_movies()
        self.titles = [m.title for m in self.movies]
        keywords = [m.keywords for m in self.movies]
        self.sparse_matrix = self.tfidf_vectorizer.fit_transform(keywords)
                
    def recommend(self, title, num_recommendations) -> List[Movie]:
        if self.sparse_matrix is None:
            raise HTTPException(400, "TF-IDF was not initialized!")
        if title not in self.titles:
            raise HTTPException(404, f"The title:{title} was not found!")
        
        idx = self.titles.index(title)
        query = self.sparse_matrix[idx]
        scores = cosine_similarity(query, self.sparse_matrix).flatten()
        
        ordered_score_idx = (-scores).argsort()
        recommended_movies_idx = ordered_score_idx[1:num_recommendations+1].tolist()
        recommended_movies = [self.movies[m_id] for m_id in recommended_movies_idx]
        
        return recommended_movies