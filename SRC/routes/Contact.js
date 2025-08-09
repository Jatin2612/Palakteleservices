const express = require('express');
const { db } = require('../config/database');
const { contactValidation, newsletterValidation, handleValidationErrors } = require('../middleware/validation');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// Submit contact form
router.post('/', contactValidation, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    db.run(
      `INSERT INTO contact_inquiries (name, email, phone, service, message)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone, service, message],
      async function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to submit inquiry' });
        }

            try {
          await sendEmail({
            to: email,
            subject: 'Thank you for contacting PALAK TELESERVICES',
            template: 'contact-confirmation',
            data: { name, service, message }
          });

          // Send notification email to admin
          await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: 'New Contact Inquiry - PALAK TELESERVICES',
            template: 'admin-notification',
            data: { name, email, phone, service, message, inquiryId: this.lastID }
          });
        } catch (emailError) {
          console.error('Email error:', emailError);
          // Don't fail the request if email fails
        }

        res.status(201).json({
          message: 'Inquiry submitted successfully',
          inquiryId: this.lastID
        });
      }
    );
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.post('/newsletter', newsletterValidation, handleValidationErrors, async (req, res) => {
  try {
    const { email } = req.body;

    db.run(
      'INSERT OR IGNORE INTO newsletter_subscriptions (email) VALUES (?)',
      [email],
      async function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to subscribe' });
        }

        if (this.changes === 0) {
          return res.status(400).json({ error: 'Email already subscribed' });
        }

        // Send welcome email
        try {
          await sendEmail({
            to: email,
            subject: 'Welcome to PALAK TELESERVICES Newsletter',
            template: 'newsletter-welcome',
            data: { email }
          });
        } catch (emailError) {
          console.error('Newsletter email error:', emailError);
        }

        res.status(201).json({
          message: 'Successfully subscribed to newsletter'
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});