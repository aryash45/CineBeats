const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { dbHelper } = require('../config/database');

// GET /reviews/:mediaType/:mediaId
router.get('/:mediaType/:mediaId', async (req, res) => {
  try {
    const { mediaType, mediaId } = req.params;
    
    const query = `
      SELECT r.id, r.user_id, r.rating, r.review_text, r.created_at, r.updated_at, u.username
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.media_type = ? AND r.media_id = ?
      ORDER BY r.created_at DESC
      LIMIT 20
    `;
    
    const reviews = await dbHelper.all(query, [mediaType, mediaId]);
    res.json(reviews);
  } catch (error) {
    console.error('Fetch reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /reviews
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { media_type, media_id, rating, review_text } = req.body;

    if (!media_type || !media_id || !rating) {
      return res.status(400).json({ error: 'media_type, media_id, and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (review_text && review_text.length > 500) {
      return res.status(400).json({ error: 'Review text cannot exceed 500 characters' });
    }

    // Check if user already reviewed this media
    const existing = await dbHelper.get(
      'SELECT id FROM reviews WHERE user_id = ? AND media_type = ? AND media_id = ?',
      [req.userId, media_type, media_id]
    );

    if (existing) {
      return res.status(409).json({ error: 'You have already reviewed this item. Edit your existing review instead.' });
    }

    const result = await dbHelper.run(
      'INSERT INTO reviews (user_id, media_type, media_id, rating, review_text) VALUES (?, ?, ?, ?, ?)',
      [req.userId, media_type, media_id, rating, review_text]
    );

    const newReview = await dbHelper.get(`
      SELECT r.*, u.username 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.id = ?
    `, [result.id]);

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Post review error:', error);
    res.status(500).json({ error: 'Failed to post review' });
  }
});

// PUT /reviews/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review_text } = req.body;

    // Check ownership
    const review = await dbHelper.get('SELECT id FROM reviews WHERE id = ? AND user_id = ?', [id, req.userId]);
    if (!review) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (review_text && review_text.length > 500) {
      return res.status(400).json({ error: 'Review text cannot exceed 500 characters' });
    }

    const updates = [];
    const params = [];

    if (rating !== undefined) {
      updates.push('rating = ?');
      params.push(rating);
    }
    if (review_text !== undefined) {
      updates.push('review_text = ?');
      params.push(review_text);
    }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(id);
      
      await dbHelper.run(
        `UPDATE reviews SET ${updates.join(', ')} WHERE id = ?`,
        params
      );
    }

    const updatedReview = await dbHelper.get(`
      SELECT r.*, u.username 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.id = ?
    `, [id]);

    res.json(updatedReview);
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// DELETE /reviews/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check ownership
    const review = await dbHelper.get('SELECT id FROM reviews WHERE id = ? AND user_id = ?', [id, req.userId]);
    if (!review) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }

    await dbHelper.run('DELETE FROM reviews WHERE id = ?', [id]);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;
