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
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/create-admin` - Create admin user (one-time setup)

### Contact
- `POST /api/contact` - Submit contact form
- `POST /api/contact/newsletter` - Subscribe to newsletter
- `POST /api/contact/newsletter/unsubscribe` - Unsubscribe from newsletter

### Services
- `GET /api/services` - Get all active services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services/request` - Submit service request
- `GET /api/services/request/:id/status` - Get service request status

### Partners
- `GET /api/partners` - Get all active partners
- `GET /api/partners/:id` - Get partner by ID
- `GET /api/partners/stats/overview` - Get partner statistics

### Testimonials
- `GET /api/testimonials` - Get all active testimonials
- `GET /api/testimonials/:id` - Get testimonial by ID
- `GET /api/testimonials/stats/overview` - Get testimonial statistics

### Admin (Requires Authentication)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/inquiries` - Get contact inquiries
- `PUT /api/admin/inquiries/:id/status` - Update inquiry status
- `GET /api/admin/service-requests` - Get service requests
- `PUT /api/admin/service-requests/:id/status` - Update service request status
- `GET /api/admin/newsletter-subscribers` - Get newsletter subscribers

### Health Check
- `GET /api/health` - Server health check

## Database Schema

The application uses SQLite with the following main tables:

- `users` - Admin users and authentication
- `contact_inquiries` - Contact form submissions
- `services` - Available telecom services
- `partners` - Business partners
- `testimonials` - Customer testimonials
- `newsletter_subscriptions` - Newsletter subscribers
- `service_requests` - Service request submissions

## Environment Variables

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@palakteleservices.com

# Database Configuration
DB_PATH=./database/palak_teleservices.db

# Admin Configuration
ADMIN_EMAIL=admin@palakteleservices.com
ADMIN_PASSWORD=admin123
```

## Email Configuration

The application supports email notifications for:
- Contact form confirmations
- Service request confirmations
- Newsletter welcome emails
- Admin notifications

Configure your SMTP settings in the `.env` file. Gmail is used as an example, but any SMTP provider can be used.

## Security Features

- Helmet.js for security headers
- CORS configuration
- JWT authentication for admin routes
- Input validation and sanitization
- SQL injection prevention
- Rate limiting ready (can be added)

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

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Configure production database settings
3. Set up proper email SMTP configuration
4. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name palak-api
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details