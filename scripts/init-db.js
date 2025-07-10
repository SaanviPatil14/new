const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();


const initializeDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ userType: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create default admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@election.com',
      password: 'admin123',
      firstName: 'System',
      lastName: 'Administrator',
      userType: 'admin',
      isActive: true
    });

    await adminUser.save();
    console.log('Default admin user created successfully');
    console.log('Email: admin@election.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login');

    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initializeDatabase(); 