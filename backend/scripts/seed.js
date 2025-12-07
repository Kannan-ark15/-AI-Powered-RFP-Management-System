const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const RFP = require('../src/models/RFP');
const Vendor = require('../src/models/Vendor');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Vendor.deleteMany({});
  await RFP.deleteMany({});

  const vendors = await Vendor.insertMany([
    {
      name: 'Tech Solutions Inc',
      email: 'contact@techsolutions.com',
      phone: '555-0101',
      company: 'Tech Solutions Inc',
      specialties: ['Web Development', 'Mobile Apps', 'Cloud Services']
    },
    {
      name: 'Digital Innovations',
      email: 'hello@digitalinnovations.com',
      phone: '555-0102',
      company: 'Digital Innovations LLC',
      specialties: ['AI/ML', 'Data Analytics', 'Custom Software']
    },
    {
      name: 'Creative Developers',
      email: 'team@creativedev.com',
      phone: '555-0103',
      company: 'Creative Developers',
      specialties: ['UI/UX Design', 'Frontend Development', 'Branding']
    }
  ]);

  const rfps = await RFP.insertMany([
    {
      title: 'E-commerce Platform Development',
      description: 'Build a scalable e-commerce platform with inventory management',
      requirements: [
        'Shopping cart functionality',
        'Payment gateway integration',
        'Admin dashboard',
        'Mobile responsive design'
      ],
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      budget: 75000,
      contactEmail: 'projects@company.com',
      status: 'draft'
    },
    {
      title: 'Mobile App for Fitness Tracking',
      description: 'iOS and Android app for tracking workouts and nutrition',
      requirements: [
        'User authentication',
        'Workout logging',
        'Nutrition tracking',
        'Social features',
        'Integration with wearables'
      ],
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      budget: 100000,
      contactEmail: 'apps@fittech.com',
      status: 'draft'
    }
  ]);

  console.log('Database seeded successfully');
  console.log(`Created ${vendors.length} vendors`);
  console.log(`Created ${rfps.length} RFPs`);

  await mongoose.connection.close();
}

seed().catch(console.error);