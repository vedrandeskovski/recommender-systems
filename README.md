# Overview

This project gives an overview and compares two recommendation system approaches:

- Content-Based Filtering
- Collaborative Filtering

Using the publicly available MovieLens Small dataset, both models were implemented, evaluated, and integrated into a web app to demonstrate their behaviours in a real-world scenario.

# Technologies used:

- Backend: FastAPI
- Frontend: Next.js
- Database: PostgreSQL
- Machine Learning: Scikit-learn, PyTorch
- Data Processing: Pandas

# How it works

## Content-Based Filtering

- Uses TF-IDF to represent movies as vectors based on their features
- Recommends movies whose features are similar to the inputed movie
- Usage of cosine similarity to measure similarity between vectors

## Collaborative Filtering

- Uses Neural Collaborative Filtering architecture
- Users and movies are brought down to a latent space
- Learns non-linear patterns from the latent representations

# Features

- Comparing two recommendation approaches
- Interactive web app for testing purposes
- Integration of ML models into a full-stack app

# Notes

- The app is hosted on free tier services and may require a manual restart from my end
