from fastapi import Depends
from sqlalchemy.orm import Session
from configuration.database import SessionLocal
from services.movie_service import MovieService
from services.tf_idf_service import TFIDFService
from services.ncf_service import NCFService
from repositories.movie_repository import MovieRepository
from services.rating_service import RatingService
from repositories.rating_repository import RatingRepository
from models.movie import Movie
from typing import Tuple
import numpy as np
import os
import re

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
def get_movie_service(db:Session = Depends(get_db)) -> MovieService:
    return MovieService(MovieRepository(db))

def get_rating_service(db:Session = Depends(get_db)) -> RatingService:
    return RatingService(RatingRepository(db))

def get_tfidf_service() -> TFIDFService:
    db = SessionLocal()
    try:
        service = TFIDFService(MovieRepository(db))
        service.fit_transform()
        return service
    finally:
        db.close()
        
def get_ncf_service() -> Tuple[NCFService, dict[int, int], dict[int, Movie]]:
    db = SessionLocal()
    rating_repository = RatingRepository(db)
    try:
        MODEL_PATH = os.path.abspath(os.path.join(CURRENT_DIR, "..", "pytorch_models"))
        ncf_service = NCFService(rating_repository, MODEL_PATH)
        rating_service = RatingService(rating_repository)
        return (
            ncf_service, 
            rating_service.get_zeroed_to_raw_mapping(),
            rating_service.get_movies_info()
            )
    finally:
        db.close()
        
def get_trained_users() -> set[int]:
    TRAINED_USERS_PATH = os.path.abspath(os.path.join(CURRENT_DIR, "..", "trained_users"))
    user_file = None
    best_version = -1
    
    for filename in os.listdir(TRAINED_USERS_PATH):
        m = re.match(r"v(\d+)_.*\.npy$",filename)
        if m:
            version = int(m.group(1))
            if version > best_version:
                best_version = version
                user_file = filename
    if user_file is None:
        raise FileNotFoundError(f"No models found in: {TRAINED_USERS_PATH}")
    users_path = os.path.join(TRAINED_USERS_PATH, user_file)
    return set(np.load(users_path))