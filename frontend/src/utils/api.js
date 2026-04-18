import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const getHeaders = (token) => {
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Authentication
  signup: async (email, password, username) => {
    const res = await axios.post(`${API_BASE}/auth/signup`, { email, password, username });
    return res.data;
  },
  login: async (email, password) => {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    return res.data;
  },
  getProfile: async (token) => {
    const res = await axios.get(`${API_BASE}/auth/profile`, { headers: getHeaders(token) });
    return res.data;
  },
  updateProfile: async (token, data) => {
    const res = await axios.put(`${API_BASE}/auth/profile`, data, { headers: getHeaders(token) });
    return res.data;
  },

  // Movies
  getTrendingMovies: async () => {
    const res = await axios.get(`${API_BASE}/movies/trending`);
    return res.data;
  },
  searchMovies: async (query, token) => {
    const res = await axios.get(`${API_BASE}/movies/search`, {
      params: { query },
      headers: getHeaders(token)
    });
    return res.data;
  },
  getMovieDetails: async (id) => {
    const res = await axios.get(`${API_BASE}/movies/${id}`);
    return res.data;
  },

  // Music
  getTrendingSongs: async () => {
    const res = await axios.get(`${API_BASE}/music/trending`);
    return res.data;
  },
  searchSongs: async (query, token) => {
    const res = await axios.get(`${API_BASE}/music/search`, {
      params: { query },
      headers: getHeaders(token)
    });
    return res.data;
  },
  getSongDetails: async (id) => {
    const res = await axios.get(`${API_BASE}/music/${id}`);
    return res.data;
  },

  // Watchlist
  getWatchlist: async (token) => {
    const res = await axios.get(`${API_BASE}/watchlist`, { headers: getHeaders(token) });
    return res.data;
  },
  addToWatchlist: async (token, mediaType, mediaId, mediaTitle, mediaPoster) => {
    const res = await axios.post(`${API_BASE}/watchlist`, 
      { media_type: mediaType, media_id: mediaId, media_title: mediaTitle, media_poster: mediaPoster },
      { headers: getHeaders(token) }
    );
    return res.data;
  },
  removeFromWatchlist: async (token, itemId) => {
    const res = await axios.delete(`${API_BASE}/watchlist/${itemId}`, { headers: getHeaders(token) });
    return res.data;
  },
  clearWatchlist: async (token) => {
    const res = await axios.delete(`${API_BASE}/watchlist/clear`, { headers: getHeaders(token) });
    return res.data;
  },

  // Reviews
  getReviews: async (mediaType, mediaId) => {
    const res = await axios.get(`${API_BASE}/reviews/${mediaType}/${mediaId}`);
    return res.data;
  },
  postReview: async (token, mediaType, mediaId, rating, reviewText) => {
    const res = await axios.post(`${API_BASE}/reviews`, 
      { media_type: mediaType, media_id: mediaId, rating, review_text: reviewText },
      { headers: getHeaders(token) }
    );
    return res.data;
  },
  deleteReview: async (token, reviewId) => {
    const res = await axios.delete(`${API_BASE}/reviews/${reviewId}`, { headers: getHeaders(token) });
    return res.data;
  },
  updateReview: async (token, reviewId, rating, reviewText) => {
    const res = await axios.put(`${API_BASE}/reviews/${reviewId}`, 
      { rating, review_text: reviewText },
      { headers: getHeaders(token) }
    );
    return res.data;
  },

  // Advanced Search
  advancedSearch: async (filters) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await axios.get(`${API_BASE}/movies/advanced/discover?${queryParams}`);
      return res.data;
    } catch (error) {
      console.error('Error in advancedSearch:', error);
      throw error;
    }
  }
};

export default api;
