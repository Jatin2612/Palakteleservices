const express = require('express');
const { db } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard statistics
router.get('/dashboard', (req, res) => {
  const queries = [
    'SELECT COUNT(*) as total_inquiries FROM contact_inquiries',
    'SELECT COUNT(*) as pending_inquiries FROM contact_inquiries WHERE status = "pending"',
    'SELECT COUNT(*) as total_service_requests FROM service_requests',
    'SELECT COUNT(*) as pending_service_requests FROM service_requests WHERE status = "pending"',
    'SELECT COUNT(*) as newsletter_subscribers FROM newsletter_subscriptions WHERE is_active = 1',
    'SELECT COUNT(*) as total_services FROM services WHERE is_active = 1',
    'SELECT COUNT(*) as total_partners FROM partners WHERE is_active = 1',
    'SELECT COUNT(*) as total_testimonials FROM testimonials WHERE is_active = 1'
  ];

  Promise.all(queries.map(query => 
    new Promise((resolve, reject) => {
      db.get(query, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    })
  )).then(results => {
    res.json({
      totalInquiries: results[0].total_inquiries,
      pendingInquiries: results[1].pending_inquiries,
      totalServiceRequests: results[2].total_service_requests,
      pendingServiceRequests: results[3].pending_service_requests,
      newsletterSubscribers: results[4].newsletter_subscribers,
      totalServices: results[5].total_services,
      totalPartners: results[6].total_partners,
      totalTestimonials: results[7].total_testimonials
    });
  }).catch(err => {
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  });
});

// Contact inquiries management
router.get('/inquiries', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const status = req.query.status;
 let query = 'SELECT * FROM contact_inquiries';
  let params = [];

  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.all(query, params, (err, inquiries) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch inquiries' });
    }

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM contact_inquiries';
    let countParams = [];

    if (status) {
      countQuery += ' WHERE status = ?';
      countParams.push(status);
    }

    db.get(countQuery, countParams, (err, countResult) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch inquiry count' });
      }

      res.json({
        inquiries,
        pagination: {
          page,
          limit,
          total: countResult.total,
          pages: Math.ceil(countResult.total / limit)
        }
      });
    });
  });
});

// Update inquiry status
router.put('/inquiries/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'in-progress', 'resolved', 'closed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.run(
    'UPDATE contact_inquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update inquiry status' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Inquiry not found' });
      }

      res.json({ message: 'Inquiry status updated successfully' });
    }
  );
});

// Service requests management
router.get('/service-requests', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const status = req.query.status;

  let query = 'SELECT * FROM service_requests';
  let params = [];

  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.all(query, params, (err, requests) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch service requests' });
    }

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM service_requests';
    let countParams = [];

    if (status) {
      countQuery += ' WHERE status = ?';
      countParams.push(status);
    }