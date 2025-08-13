const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email templates
const templates = {
  'contact-confirmation': (data) => ({
    subject: 'Thank you for contacting PALAK TELESERVICES',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #10b981 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">PALAK TELESERVICES</h1>
        </div>
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #1e293b;">Thank you for your inquiry, ${data.name}!</h2>
          <p style="color: #64748b; line-height: 1.6;">
            We have received your inquiry regarding <strong>${data.service || 'our services'}</strong> and our team will get back to you within 24 hours.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Your Message:</h3>
            <p style="color: #64748b; font-style: italic;">"${data.message}"</p>
          </div>
          <p style="color: #64748b;">
            In the meantime, feel free to explore our services or contact us directly at:
          </p>
          <ul style="color: #64748b;">
            <li>Phone: +91 22 1234 5678</li>
            <li>Email: sales@palakteleservices.com</li>
          </ul>
        </div>
        <div style="background: #1e293b; padding: 20px; text-align: center; color: white;">
          <p style="margin: 0;">© 2023 PALAK TELESERVICES. All rights reserved.</p>
        </div>
      </div>
    `
  }),
  'admin-notification': (data) => ({
    subject: 'New Contact Inquiry - PALAK TELESERVICES',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e293b;">New Contact Inquiry #${data.inquiryId}</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
          <p><strong>Service:</strong> ${data.service || 'Not specified'}</p>
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
            ${data.message}
          </div>
        </div>
        <p style="margin-top: 20px;">
          <a href="${process.env.FRONTEND_URL}/admin/inquiries" style="background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            View in Admin Panel
          </a>
        </p>
      </div>
    `
  }),
