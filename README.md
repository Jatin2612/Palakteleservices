# PALAK TELESERVICES Backend API

A comprehensive backend API for the PALAK TELESERVICES website built with Node.js, Express, and SQLite.

## Features

- **Contact Management**: Handle contact form submissions and inquiries
- **Service Management**: Manage telecom services and service requests
- **Partner Management**: Manage business partners and their information
- **Testimonials**: Handle customer testimonials and reviews
- **Newsletter**: Subscription management for newsletters
- **Admin Panel**: Complete admin interface for managing all aspects
- **Authentication**: JWT-based authentication for admin users
- **Email Notifications**: Automated email notifications for various actions
- **File Uploads**: Support for image and document uploads
- **Database**: SQLite database with proper schema and relationships

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Initialize the database and create admin user:
   ```bash
   npm run setup
   ```

5. Start the development server:
   ```bash
   npm run dev


## Database Schema

The application uses SQLite with the following main tables:

- `users` - Admin users and authentication
- `contact_inquiries` - Contact form submissions
- `services` - Available telecom services
- `partners` - Business partners
- `testimonials` - Customer testimonials
- `newsletter_subscriptions` - Newsletter subscribers
- `service_requests` - Service request submissions

## Email Configuration

The application supports email notifications for:
- Contact form confirmations
- Service request confirmations
- Newsletter welcome emails
- Admin notifications

Configure your SMTP settings in the `.env` file. Gmail is used as an example, but any SMTP provider can be used.



## File Structure

```
src/
├── config/
│   └── database.js          # Database configuration and initialization
├── middleware/
│   ├── auth.js             # Authentication middleware
│   ├── errorHandler.js     # Global error handling
│   └── validation.js       # Input validation rules
├── routes/
│   ├── admin.js            # Admin panel routes
│   ├── auth.js             # Authentication routes
│   ├── contact.js          # Contact form routes
│   ├── partners.js         # Partners routes
│   ├── services.js         # Services routes
│   └── testimonials.js     # Testimonials routes
└── utils/
    └── email.js            # Email utility functions
```

## Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. The API will be available at `http://localhost:3000`

3. Admin panel endpoints require authentication. Use the admin credentials created during setup.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details