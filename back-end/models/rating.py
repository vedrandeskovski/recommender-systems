from sqlalchemy import Column, Float, Integer, String
from configuration.database import Base

class Rating(Base):
    __tablename__ = "ratings"
    movieId = Column(Integer, primary_key=True)
    userId = Column(Integer, primary_key=True)
    rating = Column(Float)
    zeroed_userId = Column("0ed-userId", Integer)
    zeroed_movieId = Column("0ed-movieId", Integer)