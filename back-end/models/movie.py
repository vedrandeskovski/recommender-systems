from sqlalchemy import Column, Integer, String
from configuration.database import Base

class Movie(Base):
    __tablename__ = "movies"
    movieId = Column(Integer, primary_key=True)
    title = Column(String)
    genres = Column(String)
    year = Column(Integer)
    tag = Column(String)
    keywords = Column(String)