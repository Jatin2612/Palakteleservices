const express = require('express');
const { db } = require('../config/database');
const { serviceRequestValidation, handleValidationErrors } = require('../middleware/validation');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// Get all active services
router.get('/', (req, res) => {
  db.all(
    'SELECT * FROM services WHERE is_active = 1 ORDER BY created_at ASC',
    (err, services) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch services' });
      }

      // Parse features JSON
      const servicesWithFeatures = services.map(service => ({
        ...service,
        features: service.features ? JSON.parse(service.features) : []
      }));

      res.json(servicesWithFeatures);
    }
  );
});

// Get service by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get(
    'SELECT * FROM services WHERE id = ? AND is_active = 1',
    [id],
    (err, service) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch service' });
      }

      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }

      // Parse features JSON
      service.features = service.features ? JSON.parse(service.features) : [];

      res.json(service);
    }
  );
});
// Submit service request
router.post('/request', serviceRequestValidation, handleValidationErrors, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      service_type,
      requirements,
      budget_range,
      timeline
    } = req.body;

    db.run(
      `INSERT INTO service_requests 
       (name, email, phone, company, service_type, requirements, budget_range, timeline)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, company, service_type, requirements, budget_range, timeline],
      async function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to submit service request' });
        }

        // Send confirmation email to user
        try {
          await sendEmail({
            to: email,
            subject: 'Service Request Received - PALAK TELESERVICES',
            template: 'service-request-confirmation',
            data: {
              name,
              service_type,
              requirements,
              requestId: this.lastID
            }
          });

          // Send notification email to admin
          await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: 'New Service Request - PALAK TELESERVICES',
            template: 'service-request-notification',
            data: {
              name,
              email,
              phone,
              company,
              service_type,
              requirements,
              budget_range,
              timeline,
              requestId: this.lastID
            }
          });
        } catch (emailError) {
          console.error('Email error:', emailError);
        }
        res.status(201).json({
          message: 'Service request submitted successfully',
          requestId: this.lastID
        });
      }
    );
  } catch (error) {
    console.error('Service request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get service request status
router.get('/request/:id/status', (req, res) => {
  const { id } = req.params;

  db.get(
    'SELECT id, status, created_at, updated_at FROM service_requests WHERE id = ?',
    [id],
    (err, request) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch request status' });
      }

      if (!request) {
        return res.status(404).json({ error: 'Service request not found' });
      }

      res.json(request);
    }
  );
});

module.exports = router;
