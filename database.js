const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || './database/palak_teleservices.db';
const dbDir = path.dirname(dbPath);

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table for admin authentication
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'admin',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

       db.run(`
        CREATE TABLE IF NOT EXISTS contact_inquiries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          service TEXT,
          message TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Services table
      db.run(`
        CREATE TABLE IF NOT EXISTS services (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          icon TEXT,
          features TEXT,
          price_range TEXT,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
 db.run(`
        CREATE TABLE IF NOT EXISTS partners (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          logo_url TEXT,
          website_url TEXT,
          description TEXT,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Testimonials table
      db.run(`
        CREATE TABLE IF NOT EXISTS testimonials (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          position TEXT,
          company TEXT,
          message TEXT NOT NULL,
          rating INTEGER DEFAULT 5,
          avatar_url TEXT,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Newsletter subscriptions table
      db.run(`
        CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS service_requests (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          company TEXT,
          service_type TEXT NOT NULL,
          requirements TEXT,
          budget_range TEXT,
          timeline TEXT,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Insert default data
      insertDefaultData();
    });

    db.get("SELECT name FROM sqlite_master WHERE type='table'", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const insertDefaultData = () => {
  // Insert default services
  const defaultServices = [
    {
      title: 'PRI Solutions',
      description: 'High-quality Primary Rate Interface solutions for enterprise communication needs with reliable connectivity.',
      icon: 'fas fa-phone-alt',
      features: JSON.stringify(['30-Channel PRI Lines', '99.99% Uptime Guarantee', 'Seamless Migration Support']),
      price_range: 'Contact for pricing'
    },
    {
      title: 'SIM Card Distribution',
      description: 'Premium SIM card services through our partnerships with leading telecom providers.',
      icon: 'fas fa-sim-card',
      features: JSON.stringify(['Bulk SIM Card Issuance', 'Custom Data Plans', 'Corporate Plan Management']),
      price_range: 'Volume-based pricing'
    },
    {
      title: 'Enterprise Solutions',
      description: 'Custom telecom solutions designed specifically for large organizations.',
      icon: 'fas fa-building',
      features: JSON.stringify(['Virtual PBX Systems', 'MPLS & VPN Services', 'Dedicated Account Manager']),
      price_range: 'Custom pricing'
    }
  ];
   defaultServices.forEach(service => {
    db.run(`
      INSERT OR IGNORE INTO services (title, description, icon, features, price_range)
      VALUES (?, ?, ?, ?, ?)
    `, [service.title, service.description, service.icon, service.features, service.price_range]);
  });

  // Insert default partners
  const defaultPartners = [
    { name: 'Tata Teleservices', logo_url: '/images/partners/tata.png', website_url: 'https://www.tatateleservices.com' },
    { name: 'Reliance Jio', logo_url: '/images/partners/jio.png', website_url: 'https://www.jio.com' },
    { name: 'Vodafone Idea', logo_url: '/images/partners/vodafone.png', website_url: 'https://www.vodafoneidea.com' },
    { name: 'Airtel', logo_url: '/images/partners/airtel.png', website_url: 'https://www.airtel.in' }
  ];

  defaultPartners.forEach(partner => {
    db.run(`
      INSERT OR IGNORE INTO partners (name, logo_url, website_url)
      VALUES (?, ?, ?)
    `, [partner.name, partner.logo_url, partner.website_url]);
  });

  // Insert default testimonials
  const defaultTestimonials = [
    {
      name: 'Rohan Mehta',
      position: 'CEO',
      company: 'TechVista Solutions',
      message: 'PALAK TELESERVICES transformed our enterprise communication with their PRI solutions. Their 24/7 support is exceptional.',
      rating: 5,
      avatar_url: '/images/testimonials/rohan.jpg'
    },
    {
      name: 'Anita Desai',
      position: 'Head of Operations',
      company: 'RetailChain India',
      message: 'Their bulk SIM card distribution service saved us time and money. The corporate plans are perfectly tailored for our national workforce.',
      rating: 5,
      avatar_url: '/images/testimonials/anita.jpg'
    },
    {
      name: 'Vijay Kumar',
      position: 'IT Manager',
      company: 'FinServ Corp',
      message: 'The enterprise solutions from PALAK TELESERVICES provide the reliability our financial services require. Excellent account management.',
      rating: 4,
      avatar_url: '/images/testimonials/vijay.jpg'
    }
  ];

  defaultTestimonials.forEach(testimonial => {
    db.run(`
      INSERT OR IGNORE INTO testimonials (name, position, company, message, rating, avatar_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [testimonial.name, testimonial.position, testimonial.company, testimonial.message, testimonial.rating, testimonial.avatar_url]);
  });
};

module.exports = { db, initializeDatabase };
