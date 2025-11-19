from fastapi import HTTPException
from pytorch_models.models import ModelA, ModelB, ModelC, ModelD
import torch
from repositories.rating_repository import RatingRepository
from typing import List, Tuple
from models.dtos.rating_response import RatingResponse
from fastapi_pagination import Page
from models.movie import Movie
import re
import os

class NCFService:
    def __init__(self, rating_repository: RatingRepository, models_path: str):
        self.rating_repository = rating_repository
        self.models_path = models_path
        self.model_by_name = {
            "ModelA": ModelA,
            "ModelB": ModelB,
            "ModelC": ModelC,
            "ModelD": ModelD
        }
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = self.load_model()

        
    def get_best_model_file(self):
        best_file = None
        best_model_name = None
        best_version = -1
        
        for filename in os.listdir(self.models_path):
            m = re.match(r"v(\d+)_best_model_(Model[A-Z])\.pth$",filename)
            if m:
                version = int(m.group(1))
                model_name = m.group(2)
                if version > best_version:
                    best_version = version
                    best_model_name = model_name
                    best_file = filename
        if best_file is None:
            raise FileNotFoundError(f"No models found in: {self.models_path}")
        model_path = os.path.join(self.models_path, best_file)
        return model_path, best_model_name
                    
        
        
    def load_model(self) -> torch.nn.Module:
        model_path, model_name = self.get_best_model_file()
        state_dict = torch.load(model_path, map_location=self.device)
        
        user_emb_weight = state_dict['user_embeddings.weight']
        movie_emb_weight = state_dict['movie_embeddings.weight']
        num_users, embedding_dim = user_emb_weight.shape
        num_movies = movie_emb_weight.shape[0]
        num_of_hidden_neurons = state_dict['embedding_fc.0.weight'].shape[0]
        
        #model = ModelA(num_users, num_movies, embedding_dim, num_of_hidden_neurons)
        model = self.model_by_name.get(model_name)(num_users, num_movies, embedding_dim, num_of_hidden_neurons)
        model.to(self.device)
        model.load_state_dict(state_dict)
        model.eval()
        
        return model
    
    def recommend(self, 
                  user_id: int,
                  num_recommendations: int,
                  zeroed_to_raw_map: dict[int, int],
                  movies_info: dict[int, Movie],
                  cache: dict[Tuple[int, int], Page[RatingResponse]]
                  ) -> List[RatingResponse]:
        key = (user_id, num_recommendations)
        if key in cache:
            return cache[key]
        unrated_movie_ids = self.rating_repository.get_all_unrated_zeroed_movie_ids_for_user(user_id)
        
        if not unrated_movie_ids:
            raise HTTPException(400, f"User with id:{user_id} has not rated any movies!")
        

        user_tensor = torch.tensor([user_id] * len(unrated_movie_ids))
        movie_tensor = torch.tensor(unrated_movie_ids)
        batch_size = 512
        preds_list = []
        
        with torch.inference_mode():
            for i in range(0, len(unrated_movie_ids), batch_size):
                user_batch = user_tensor[i:i+batch_size].to(self.device)
                movie_batch = movie_tensor[i:i+batch_size].to(self.device)
                preds_list.append(self.model(user_batch, movie_batch).squeeze())
            # preds = self.model(user_tensor, movie_tensor).squeeze()
            # preds = torch.clamp(preds, 0, 5)
        preds = torch.cat(preds_list)
        preds = torch.clamp(preds, 0, 5)
        
        responses = []
        for zeroed_movie_id, pred_rating in zip(unrated_movie_ids, preds.tolist()):
            movie_id = zeroed_to_raw_map[zeroed_movie_id]
            movie = movies_info[movie_id]
            responses.append(
                RatingResponse(
                    movieId=movie_id,
                    title=movie.title,
                    year=movie.year,
                    keywords=movie.keywords,
                    rating=round(pred_rating,2)
                )
            )
        responses.sort(key=lambda m: m.rating, reverse=True)
        top_recommendations =  responses[:num_recommendations]
        cache[key] = top_recommendations
        return top_recommendations
    