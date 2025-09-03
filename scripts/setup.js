const bcrypt = require('bcryptjs');
const { db, initializeDatabase } = require('../src/config/database');

async function setupDatabase() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    
    console.log('Creating admin user...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@palakteleservices.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    db.run(
      'INSERT OR REPLACE INTO users (email, password, role) VALUES (?, ?, ?)',
      [adminEmail, hashedPassword, 'admin'],
      function(err) {
        if (err) {
          console.error('Failed to create admin user:', err);
        } else {
          console.log('Admin user created successfully');
          console.log(`Email: ${adminEmail}`);
          console.log(`Password: ${adminPassword}`);
          console.log('\nIMPORTANT: Please change the admin password after first login!');
        }
        
        db.close();
        process.exit(0);
      }
    );
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();