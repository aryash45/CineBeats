const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const { dbHelper } = require('../config/database');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper to check for auth optionally
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authMiddleware(req, res, () => next());
  }
  next();
};

// GET /movies/trending
router.get('/trending', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
      params: { api_key: TMDB_API_KEY }
    });
    
    // Return top 10 movies
    const movies = response.data.results.slice(0, 10).map(m => ({
      id: m.id,
      title: m.title,
      poster_path: m.poster_path,
      genre_ids: m.genre_ids,
      vote_average: m.vote_average
    }));

    res.json(movies);
  } catch (error) {
    console.error('TMDB trending error:', error.message);
    res.status(500).json({ error: 'Failed to fetch trending movies' });
  }
});

// GET /movies/search?query=
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Query parameter is required' });

    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: { api_key: TMDB_API_KEY, query }
    });

    // Save search history if user is logged in
    if (req.userId) {
      dbHelper.run('INSERT INTO search_history (user_id, query, media_type) VALUES (?, ?, ?)', [req.userId, query, 'movie'])
        .catch(err => console.error('Failed to log search history:', err));
    }

    res.json(response.data.results);
  } catch (error) {
    console.error('TMDB search error:', error.message);
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

// GET /movies/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
      params: { 
        api_key: TMDB_API_KEY,
        append_to_response: 'credits,videos'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('TMDB detail error:', error.message);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

// GET /movies/:id/recommendations
router.get('/:id/recommendations', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}/recommendations`, {
      params: { api_key: TMDB_API_KEY }
    });

    // Return 5 similar movies
    res.json(response.data.results.slice(0, 5));
  } catch (error) {
    console.error('TMDB recommendation error:', error.message);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Advanced Search (Discover)
router.get('/advanced/discover', async (req, res) => {
  try {
    const { genre, year, rating, sortBy } = req.query;
    const params = {
      api_key: TMDB_API_KEY,
      with_genres: genre,
      primary_release_year: year,
      'vote_average.gte': rating,
      sort_by: sortBy || 'popularity.desc',
      include_adult: false,
      include_video: false,
      page: 1
    };
    
    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, { params });
    res.json(response.data.results);
  } catch (error) {
    console.error('TMDB Discover Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error fetching advanced search results' });
  }
});

module.exports = router;
