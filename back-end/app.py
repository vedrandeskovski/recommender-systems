from fastapi import Depends, FastAPI, Query
from typing import Literal
from fastapi_pagination import Page, add_pagination, paginate
from fastapi_pagination.utils import disable_installed_extensions_check
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from configuration.dependencies import get_movie_service, get_rating_service, \
    get_tfidf_service, get_ncf_service, get_trained_users
from models.dtos.movie_response import MovieResponse, TitleResponse
from models.dtos.rating_response import RatingResponse
from services.movie_service import MovieService
from services.rating_service import RatingService
from typing import List

disable_installed_extensions_check()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting...")
    app.state.tfidf_service = get_tfidf_service()
    print("Finished loading TF-IDF")
    app.state.ncf_service, app.state.raw_by_zero_id, app.state.movies_info = get_ncf_service()
    print("Finished loading NCF")
    app.state.trained_users = get_trained_users()
    print("Finished loading trained users")
    app.state.ncf_cache = {}
    yield
    print("Closing...")
    
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/movies", response_model=Page[MovieResponse])
def get_all_movies(sort_by: Literal["year", "title"] | None = Query(None),
                         order: Literal["asc", "desc"] = Query("asc"),
                         movie_service:MovieService = Depends(get_movie_service)):
    movies = movie_service.get_all_movies(sort_by, order)
    return paginate(movies)

@app.get("/titles", response_model=List[TitleResponse])
def get_titles(query: str, movie_service:MovieService = Depends(get_movie_service)):
    return movie_service.get_titles(query)

@app.get("/movie_by_title", response_model=MovieResponse)
def get_movie_by_title(title: str, movie_service: MovieService = Depends(get_movie_service)):
    return movie_service.get_movie_by_title(title)

@app.get("/users/{id}/ratings", response_model=Page[RatingResponse])
def get_all_rated_movies_for_user(id:int,
                                        sort_by: Literal["rating", "year", "title"] | None = Query(None),
                                        order: Literal["asc", "desc"] = Query("asc"),
                                        rating_service:RatingService = Depends(get_rating_service)):
    ratings = rating_service.get_all_ratings_for_user(id, sort_by, order, app.state.trained_users)
    return paginate(ratings)

@app.get("/users/{id}/is_trained")
def is_user_trained(id: int, rating_service:RatingService = Depends(get_rating_service)):
    return rating_service.is_user_trained(id, app.state.trained_users)

@app.get("/tfidf", response_model=Page[MovieResponse])
def get_tfidf_recommendation(title: str, num_recommendations:int):
    recommendations = app.state.tfidf_service.recommend(title, num_recommendations)
    return paginate(recommendations)

@app.get("/ncf", response_model=Page[RatingResponse])
def get_ncf_recommendation(user_id: int, num_recommendations:int):
    recommendations = app.state.ncf_service.recommend(
        user_id,
        num_recommendations,
        app.state.raw_by_zero_id,
        app.state.movies_info,
        app.state.ncf_cache
    )
    return paginate(recommendations)

@app.get("/health")
def health():
    return {"status": "ok"}


add_pagination(app)
if __name__ == "__main__":
    uvicorn.run("app:app", host="localhost", port=8080, reload=True)