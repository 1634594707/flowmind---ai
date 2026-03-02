import 'dotenv/config';
import { DataSource } from 'typeorm';
import { seedDatabase } from './seeds/seed';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'flowmind',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
});

async function run() {
  try {
    console.log('🔌 连接数据库...');
    await AppDataSource.initialize();
    console.log('✅ 数据库连接成功');

    await seedDatabase(AppDataSource);

    await AppDataSource.destroy();
    console.log('👋 数据库连接已关闭');
    process.exit(0);
  } catch (error) {
    console.error('❌ 错误:', error);
    process.exit(1);
  }
}

run();
