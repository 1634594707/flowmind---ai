# FlowMind Database Guide

## Overview

FlowMind uses PostgreSQL as the primary database with TypeORM for object-relational mapping and migrations.

## Database Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=flowmind
DATABASE_PASSWORD=flowmind123
DATABASE_NAME=flowmind
DATABASE_SSL=false

# Connection Pool
DATABASE_POOL_MAX=10
DATABASE_POOL_MIN=2

# Application
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Connection Pool

The database connection pool is configured with:

- **Max connections**: 10 (configurable via DATABASE_POOL_MAX)
- **Min connections**: 2 (configurable via DATABASE_POOL_MIN)
- **Idle timeout**: 30 seconds
- **Connection timeout**: 5 seconds

## Migrations

### Creating Migrations

#### Generate Migration from Entity Changes

```bash
# Generate migration based on entity changes
pnpm --filter flowmind-backend migration:generate src/database/migrations/MigrationName
```

#### Create Empty Migration

```bash
# Create empty migration file
pnpm --filter flowmind-backend migration:create src/database/migrations/MigrationName
```

### Running Migrations

```bash
# Run all pending migrations
pnpm db:migrate

# Or from backend directory
cd backend
pnpm migration:run
```

### Reverting Migrations

```bash
# Revert last migration
cd backend
pnpm migration:revert
```

### Viewing Migration Status

```bash
# Show migration status
cd backend
pnpm migration:show
```

## Database Schema

### Core Tables

#### users

- User accounts and authentication
- Fields: id, email, password_hash, name, avatar, role, totp_secret, is_active, last_login_at

#### sessions

- User session tokens (JWT)
- Fields: id, user_id, token, expires_at

#### api_keys

- API key authentication
- Fields: id, user_id, name, key, last_used_at, expires_at

#### projects

- Project information
- Fields: id, name, description, owner_id, status, settings

#### project_members

- Project membership and roles
- Fields: id, project_id, user_id, role, joined_at

### Indexes

Indexes are created for:

- User email lookups
- Session token lookups
- API key lookups
- Project ownership queries
- Project membership queries

## Seeding

### Running Seeds

```bash
# Seed database with development data
pnpm db:seed

# Or from backend directory
cd backend
pnpm seed
```

### Seed Structure

Seeds are located in `backend/src/database/seeds/`:

- `seed.ts` - Main seed orchestrator
- `initial-seed.sql` - SQL seed data (optional)

### Creating Custom Seeds

```typescript
// backend/src/database/seeds/seed.ts
import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

export async function seedDatabase(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  // Check if data already exists
  const existingUsers = await userRepository.count();
  if (existingUsers > 0) {
    console.log('⏭️  Database already seeded, skipping...');
    return;
  }

  console.log('🌱 Seeding users...');

  // Create admin user
  const adminUser = userRepository.create({
    email: 'admin@flowmind.ai',
    passwordHash: await bcrypt.hash('Admin123!', 10),
    name: 'Admin User',
    role: 'admin',
    isActive: true,
  });
  await userRepository.save(adminUser);

  // Create test users
  const testUser = userRepository.create({
    email: 'user@flowmind.ai',
    passwordHash: await bcrypt.hash('User123!', 10),
    name: 'Test User',
    role: 'user',
    isActive: true,
  });
  await userRepository.save(testUser);

  console.log('✅ Users seeded');
}
```

## Database Operations

### Connecting to Database

#### Using Docker

```bash
# Connect to PostgreSQL in Docker
docker-compose exec postgres psql -U flowmind -d flowmind
```

#### Using psql Locally

```bash
# Connect to local PostgreSQL
psql -h localhost -U flowmind -d flowmind
```

### Common SQL Commands

```sql
-- List all tables
\dt

-- Describe table structure
\d users

-- List all databases
\l

-- List all schemas
\dn

-- Show current database
SELECT current_database();

-- Show table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Backup and Restore

### Backup Database

```bash
# Backup entire database
docker-compose exec postgres pg_dump -U flowmind flowmind > backup.sql

# Backup specific tables
docker-compose exec postgres pg_dump -U flowmind -t users -t projects flowmind > backup_tables.sql

# Backup with compression
docker-compose exec postgres pg_dump -U flowmind flowmind | gzip > backup.sql.gz
```

### Restore Database

```bash
# Restore from backup
docker-compose exec -T postgres psql -U flowmind flowmind < backup.sql

# Restore from compressed backup
gunzip -c backup.sql.gz | docker-compose exec -T postgres psql -U flowmind flowmind
```

### Automated Backup Script

```bash
#!/bin/bash
# scripts/backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
BACKUP_FILE="$BACKUP_DIR/flowmind_$DATE.sql"

mkdir -p $BACKUP_DIR

echo "Creating backup: $BACKUP_FILE"
docker-compose exec postgres pg_dump -U flowmind flowmind > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Keep only last 30 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup complete: $BACKUP_FILE.gz"
```

## Performance Optimization

### Query Optimization

1. **Use Indexes**: Create indexes for frequently queried columns
2. **Limit Results**: Always use pagination for large result sets
3. **Select Specific Columns**: Avoid `SELECT *`
4. **Use Query Builder**: TypeORM query builder for complex queries
5. **Connection Pooling**: Configured automatically

### Monitoring Queries

```typescript
// Enable query logging in development
{
  logging: process.env.NODE_ENV === 'development',
  logger: 'advanced-console',
  maxQueryExecutionTime: 1000, // Log slow queries (> 1s)
}
```

### Analyzing Slow Queries

```sql
-- Enable query statistics
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View slow queries
SELECT
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

## Troubleshooting

### Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres pg_isready -U flowmind
```

### Migration Issues

```bash
# Check migration status
cd backend
pnpm migration:show

# Revert last migration
pnpm migration:revert

# Drop entire schema (CAUTION!)
pnpm schema:drop
```

### Reset Database

```bash
# Stop services
docker-compose down

# Remove volumes
docker-compose down -v

# Start fresh
docker-compose up -d postgres redis

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed
```

## Best Practices

1. **Never use synchronize in production**: Always use migrations
2. **Version control migrations**: Commit migration files to git
3. **Test migrations**: Test both up and down migrations
4. **Backup before migrations**: Always backup before running migrations in production
5. **Use transactions**: Wrap related operations in transactions
6. **Validate data**: Use class-validator for DTO validation
7. **Handle errors**: Implement proper error handling for database operations
8. **Monitor performance**: Track slow queries and optimize

## Resources

- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [NestJS Database Documentation](https://docs.nestjs.com/techniques/database)
