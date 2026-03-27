import { config } from 'dotenv';
import dataSource from '../config/typeorm.config';
import { seedDatabase } from './seeds/seed';

// Load environment variables
config();

async function run() {
  try {
    console.log('🔌 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Database connected successfully');

    console.log('🌱 Seeding database...');
    await seedDatabase(dataSource);
    console.log('✅ Database seeded successfully');

    await dataSource.destroy();
    console.log('👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

run();
