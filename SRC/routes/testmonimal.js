const express = require('express');
const { db } = require('../config/database');

const router = express.Router();

// Get all active testimonials
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  db.all(
    'SELECT * FROM testimonials WHERE is_active = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, offset],
    (err, testimonials) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch testimonials' });
      }

      res.json(testimonials);
    }
  );
});

// Get testimonial by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get(
    'SELECT * FROM testimonials WHERE id = ? AND is_active = 1',
    [id],
    (err, testimonial) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch testimonial' });
      }

      if (!testimonial) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }

      res.json(testimonial);
    }
  );
});
// Get testimonials statistics
router.get('/stats/overview', (req, res) => {
  db.all(
    `SELECT 
       COUNT(*) as total_testimonials,
       AVG(rating) as average_rating,
       COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star_count
     FROM testimonials 
     WHERE is_active = 1`,
    (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch testimonial statistics' });
      }

      res.json(stats[0]);
    }
  );
});

module.exports = router;