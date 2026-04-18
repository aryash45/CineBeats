const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/auth');
const { dbHelper } = require('../config/database');

// Helper to map iTunes track to expected Spotify-like frontend format
const mapItunesTrack = (track) => {
  return {
    id: String(track.trackId),
    name: track.trackName,
    artist: track.artistName,
    album: track.collectionName,
    // Get high-res artwork instead of default 100x100
    image: track.artworkUrl100 ? track.artworkUrl100.replace('100x100bb', '500x500bb') : null,
    duration_ms: track.trackTimeMillis,
    preview_url: track.previewUrl,
  };
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authMiddleware(req, res, () => next());
  }
  next();
};

// GET /music/trending
router.get('/trending', async (req, res) => {
  try {
    // The iTunes US Top Songs RSS feed in JSON format is deeply nested. 
    // To keep the backend fast and lightweight, we map search for top popular terms
    const response = await axios.get('https://itunes.apple.com/search', {
      params: { term: 'pop hits', entity: 'song', limit: 10 }
    });

    const songs = response.data.results.map(mapItunesTrack).filter(Boolean);
    res.json(songs);
  } catch (error) {
    console.error('iTunes trending error:', error.message);
    res.status(500).json({ error: 'Failed to fetch trending music' });
  }
});

// GET /music/search?query=
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Query parameter is required' });

    const response = await axios.get('https://itunes.apple.com/search', {
      params: { term: query, entity: 'song', limit: 20 }
    });

    if (req.userId) {
      dbHelper.run('INSERT INTO search_history (user_id, query, media_type) VALUES (?, ?, ?)', [req.userId, query, 'music'])
        .catch(err => console.error('Failed to log search history:', err));
    }

    const songs = response.data.results.map(mapItunesTrack);
    res.json(songs);
  } catch (error) {
    console.error('iTunes search error:', error.message);
    res.status(500).json({ error: 'Failed to search music' });
  }
});

// GET /music/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get('https://itunes.apple.com/lookup', {
      params: { id }
    });

    if (!response.data.results || response.data.results.length === 0) {
      return res.status(404).json({ error: 'Song not found' });
    }

    const track = response.data.results[0];
    
    // Simulate the Spotify detail object format expected on the SongDetails page
    res.json({
      id: String(track.trackId),
      name: track.trackName,
      artist: track.artistName,
      album: {
        id: String(track.collectionId),
        name: track.collectionName,
        images: [{ url: track.artworkUrl100 ? track.artworkUrl100.replace('100x100bb', '500x500bb') : null }],
        release_date: track.releaseDate
      },
      duration_ms: track.trackTimeMillis,
      popularity: 85, // Static fallback
      preview_url: track.previewUrl,
      external_urls: { spotify: track.trackViewUrl } // Maps to Apple Music link
    });
  } catch (error) {
    console.error('iTunes detail error:', error.message);
    res.status(500).json({ error: 'Failed to fetch song details' });
  }
});

module.exports = router;
