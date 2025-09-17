require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'tourism-website',
    });
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      country: 'Maldives',
      phoneNumber: '+960 123-4567',
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@test.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.disconnect();
  }
};

createAdminUser();