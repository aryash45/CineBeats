const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { dbHelper } = require('../config/database');

// All watchlist routes are protected
router.use(authMiddleware);

// GET /watchlist
router.get('/', async (req, res) => {
  try {
    const items = await dbHelper.all(
      'SELECT id, media_type, media_id, media_title, media_poster, added_at FROM watchlist WHERE user_id = ? ORDER BY added_at DESC',
      [req.userId]
    );
    res.json(items);
  } catch (error) {
    console.error('Watchlist fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// POST /watchlist
router.post('/', async (req, res) => {
  try {
    const { media_type, media_id, media_title, media_poster } = req.body;

    if (!media_type || !media_id || !['movie', 'song'].includes(media_type)) {
      return res.status(400).json({ error: 'Valid media_type ("movie" or "song") and media_id are required' });
    }

    try {
      const result = await dbHelper.run(
        'INSERT INTO watchlist (user_id, media_type, media_id, media_title, media_poster) VALUES (?, ?, ?, ?, ?)',
        [req.userId, media_type, media_id, media_title, media_poster]
      );
      
      const insertedItem = await dbHelper.get('SELECT * FROM watchlist WHERE id = ?', [result.id]);
      res.status(201).json(insertedItem);
    } catch (dbErr) {
      // Check for unique constraint violation (SQLITE_CONSTRAINT ignores case)
      if (dbErr.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Item already in watchlist' });
      }
      throw dbErr;
    }
  } catch (error) {
    console.error('Watchlist add error:', error);
    res.status(500).json({ error: 'Failed to add item to watchlist' });
  }
});

// DELETE /watchlist/clear
router.delete('/clear', async (req, res) => {
  try {
    await dbHelper.run('DELETE FROM watchlist WHERE user_id = ?', [req.userId]);
    res.json({ message: 'Watchlist cleared successfully' });
  } catch (error) {
    console.error('Watchlist clear error:', error);
    res.status(500).json({ error: 'Failed to clear watchlist' });
  }
});

// DELETE /watchlist/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure item exists and belongs to user
    const item = await dbHelper.get('SELECT id FROM watchlist WHERE id = ? AND user_id = ?', [id, req.userId]);
    if (!item) {
      return res.status(404).json({ error: 'Watchlist item not found or unauthorized' });
    }

    await dbHelper.run('DELETE FROM watchlist WHERE id = ?', [id]);
    res.json({ message: 'Item removed from watchlist successfully' });
  } catch (error) {
    console.error('Watchlist delete error:', error);
    res.status(500).json({ error: 'Failed to remove item from watchlist' });
  }
});

module.exports = router;
