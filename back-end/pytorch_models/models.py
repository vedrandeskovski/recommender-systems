import torch
import torch.nn as nn
from torch import Tensor

class BaseRecommender(nn.Module):
    def __init__(self, num_of_users, num_of_movies, embedding_d, num_of_hidden_neurons):
        super().__init__()
        self.num_of_users = num_of_users
        self.num_of_movies = num_of_movies
        self.embedding_d = embedding_d
        self.num_of_hidden_neurons = num_of_hidden_neurons
        
        self.user_embeddings = nn.Embedding(
            num_embeddings=num_of_users,
            embedding_dim=embedding_d
        )
        self.movie_embeddings = nn.Embedding(
            num_embeddings=num_of_movies,
            embedding_dim=embedding_d
        )
        self.embedding_fc = nn.Sequential( 
            nn.Linear(
                in_features=self.embedding_d * 2,
                out_features=self.num_of_hidden_neurons
            ),
            nn.ReLU()
        )
    
    def forward_embeddings(self, users: Tensor, movies: Tensor) -> Tensor:
        embedded_users = self.user_embeddings(users)
        embedded_movies = self.movie_embeddings(movies)
        merged_embeddings = torch.cat((embedded_users,embedded_movies), dim=1)
        return self.embedding_fc(merged_embeddings)
    
class ModelA(BaseRecommender):
    def __init__(self, num_of_users, num_of_movies, embedding_d, num_of_hidden_neurons):
        super().__init__(num_of_users, num_of_movies, embedding_d, num_of_hidden_neurons)
        
        self.ann = nn.Sequential(
            nn.Linear(
                in_features=self.num_of_hidden_neurons,
                out_features=1024
            ),
            nn.ReLU(),
            nn.Linear(
                in_features=1024,
                out_features=512
            ),
            nn.ReLU(),
            nn.Linear(
                in_features=512,
                out_features=256
            ),
            nn.ReLU(),
            nn.Linear(
                in_features=256,
                out_features=1
            )
        )
        
    def forward(self, users: Tensor, movies: Tensor) -> Tensor:
        embedding_fc_output = self.forward_embeddings(users, movies)
        output = self.ann(embedding_fc_output)
        return output
    
class ModelB(BaseRecommender):
    def __init__(self, num_of_users, num_of_movies, embedding_d, num_of_hidden_neurons):
        super().__init__(num_of_users, num_of_movies, embedding_d, num_of_hidden_neurons)
        
        self.ann = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(
                in_features=self.num_of_hidden_neurons,
                out_features=1024
            ),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(
                in_features=1024,
                out_features=512
            ),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(
                in_features=512,
                out_features=256
            ),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(
                in_features=256,
                out_features=1
            )
        )
        
    def forward(self, users: Tensor, movies: Tensor) -> Tensor:
        embedding_fc_output = self.forward_embeddings(users, movies)
        output = self.ann(embedding_fc_output)
        return output
    
class ModelC(BaseRecommender):
    def __init__(self, num_of_users, num_of_movies, embedding_d, num_of_hidden_neurons):
        super().__init__(num_of_users, num_of_movies, embedding_d, num_of_hidden_neurons)
        
        self.ann = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(
                in_features=self.num_of_hidden_neurons,
                out_features=1024
            ),
            nn.BatchNorm1d(1024, affine=False),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(
                in_features=1024,
                out_features=512
            ),
            nn.BatchNorm1d(512, affine=False),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(
                in_features=512,
                out_features=256
            ),
            nn.BatchNorm1d(256, affine=False),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(
                in_features=256,
                out_features=1
            )
        )
        
    def forward(self, users: Tensor, movies: Tensor) -> Tensor:
        embedding_fc_output = self.forward_embeddings(users, movies)
        output = self.ann(embedding_fc_output)
        return output
    
class ModelD(BaseRecommender):
    def __init__(self, num_of_users, num_of_movies, embedding_d, num_of_hidden_neurons):
        super().__init__(num_of_users, num_of_movies, embedding_d, num_of_hidden_neurons)
        
        self.ann = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(
                in_features=self.num_of_hidden_neurons,
                out_features=512
            ),
            nn.BatchNorm1d(512, affine=False),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(
                in_features=512,
                out_features=256
            ),
            nn.BatchNorm1d(256, affine=False),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(
                in_features=256,
                out_features=1
            )
        )
        
    def forward(self, users: Tensor, movies: Tensor) -> Tensor:
        embedding_fc_output = self.forward_embeddings(users, movies)
        output = self.ann(embedding_fc_output)
        return output