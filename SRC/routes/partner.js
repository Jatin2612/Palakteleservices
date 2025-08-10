const express = require('express');
const { db } = require('../config/database');

const router = express.Router();

// Get all active partners
router.get('/', (req, res) => {
  db.all(
    'SELECT * FROM partners WHERE is_active = 1 ORDER BY name ASC',
    (err, partners) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch partners' });
      }

      res.json(partners);
    }
  );
});

// Get partner by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get(
    'SELECT * FROM partners WHERE id = ? AND is_active = 1',
    [id],
    (err, partner) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch partner' });
      }

      if (!partner) {
        return res.status(404).json({ error: 'Partner not found' });
      }

      res.json(partner);
    }
  );
});

// Get partner statistics
router.get('/stats/overview', (req, res) => {
  db.get(
    'SELECT COUNT(*) as total_partners FROM partners WHERE is_active = 1',
    (err, stats) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch partner statistics' });
      }

      res.json(stats);
    }
  );
});

module.exports = router;