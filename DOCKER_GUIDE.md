# FlowMind Docker Guide

## Overview

FlowMind uses Docker and Docker Compose for containerized development and deployment. This guide covers both development and production setups.

## Prerequisites

- Docker >= 20.10
- Docker Compose >= 2.0

## Quick Start

### Development Mode (with Hot Reload)

Start all services in development mode:

```bash
docker-compose --profile dev up
```

Or use the dev-specific compose file:

```bash
docker-compose -f docker-compose.dev.yml up
```

This will start:

- PostgreSQL database (port 5432)
- Redis cache (port 6379)
- Backend API with hot reload (port 3000)
- Frontend with Vite HMR (port 5173)

### Production Mode

Start all services in production mode:

```bash
docker-compose --profile prod up -d
```

This will start:

- PostgreSQL database
- Redis cache
- Backend API (optimized build)
- Frontend (static files served by Nginx)
- Nginx reverse proxy (port 80/443)

## Services

### PostgreSQL

- **Port**: 5432
- **Database**: flowmind
- **User**: flowmind
- **Password**: flowmind123 (change in production!)
- **Data Volume**: postgres_data

### Redis

- **Port**: 6379
- **Data Volume**: redis_data
- **Persistence**: AOF enabled

### Backend (Development)

- **Port**: 3000
- **Debug Port**: 9229
- **Hot Reload**: Enabled
- **Volumes**: Source code mounted for live updates

### Frontend (Development)

- **Port**: 5173
- **Hot Reload**: Vite HMR enabled
- **Volumes**: Source code mounted for live updates

### Backend (Production)

- **Port**: 3000
- **Build**: Optimized production build
- **User**: Non-root (nodejs)

### Frontend (Production)

- **Port**: 80
- **Server**: Nginx
- **Build**: Static files

## Common Commands

### Start Services

```bash
# Development mode
docker-compose --profile dev up

# Production mode
docker-compose --profile prod up -d

# Start specific service
docker-compose up postgres redis
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend-dev

# Last 100 lines
docker-compose logs --tail=100 backend-dev
```

### Rebuild Services

```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend-dev

# Rebuild without cache
docker-compose build --no-cache
```

### Execute Commands in Containers

```bash
# Backend shell
docker-compose exec backend-dev sh

# Run migrations
docker-compose exec backend-dev pnpm migration:run

# Seed database
docker-compose exec backend-dev pnpm seed

# Frontend shell
docker-compose exec frontend-dev sh
```

### Database Operations

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U flowmind -d flowmind

# Backup database
docker-compose exec postgres pg_dump -U flowmind flowmind > backup.sql

# Restore database
docker-compose exec -T postgres psql -U flowmind flowmind < backup.sql

# Connect to Redis
docker-compose exec redis redis-cli
```

## Development Workflow

### 1. Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd FlowMind---AI

# Start services
docker-compose --profile dev up
```

### 2. Install Dependencies

Dependencies are automatically installed when containers start. If you need to reinstall:

```bash
docker-compose exec backend-dev pnpm install
docker-compose exec frontend-dev pnpm install
```

### 3. Run Migrations

```bash
docker-compose exec backend-dev pnpm migration:run
```

### 4. Seed Database

```bash
docker-compose exec backend-dev pnpm seed
```

### 5. Access Services

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/api/docs

### 6. Make Changes

Edit files in `frontend/src` or `backend/src`. Changes will be automatically reloaded.

### 7. Run Tests

```bash
# Backend tests
docker-compose exec backend-dev pnpm test

# Frontend tests
docker-compose exec frontend-dev pnpm test
```

## Production Deployment

### 1. Environment Variables

Create a `.env` file:

```env
NODE_ENV=production
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=flowmind
DATABASE_PASSWORD=<strong-password>
DATABASE_NAME=flowmind
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=<strong-secret>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### 2. Build and Start

```bash
# Build images
docker-compose --profile prod build

# Start services
docker-compose --profile prod up -d
```

### 3. Run Migrations

```bash
docker-compose exec backend pnpm migration:run
```

### 4. Health Checks

```bash
# Check service status
docker-compose ps

# Check backend health
curl http://localhost:3000/health

# Check frontend
curl http://localhost/
```

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs

# Check specific service
docker-compose logs backend-dev

# Restart services
docker-compose restart
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres pg_isready -U flowmind
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use different host port
```

### Hot Reload Not Working

```bash
# Rebuild containers
docker-compose build backend-dev frontend-dev

# Restart services
docker-compose restart backend-dev frontend-dev

# Check volumes are mounted
docker-compose exec backend-dev ls -la /app/src
```

### Out of Disk Space

```bash
# Remove unused containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Clean everything
docker system prune -a --volumes
```

## Performance Optimization

### Development

- Use named volumes for node_modules (faster than bind mounts)
- Enable BuildKit for faster builds:
  ```bash
  export DOCKER_BUILDKIT=1
  export COMPOSE_DOCKER_CLI_BUILD=1
  ```

### Production

- Use multi-stage builds (already configured)
- Minimize image layers
- Use .dockerignore to exclude unnecessary files
- Enable health checks for automatic recovery

## Security Best Practices

1. **Change Default Passwords**: Update database and Redis passwords
2. **Use Secrets**: Store sensitive data in Docker secrets or environment variables
3. **Non-Root Users**: Containers run as non-root users
4. **Network Isolation**: Services communicate through internal network
5. **Update Images**: Regularly update base images for security patches
6. **Scan Images**: Use `docker scan` to check for vulnerabilities

## Monitoring

### Container Stats

```bash
# Real-time stats
docker stats

# Specific container
docker stats flowmind-backend-dev
```

### Resource Usage

```bash
# Disk usage
docker system df

# Detailed disk usage
docker system df -v
```

## Backup and Restore

### Database Backup

```bash
# Create backup
docker-compose exec postgres pg_dump -U flowmind flowmind > backup_$(date +%Y%m%d).sql

# Automated backup script
./scripts/backup-database.sh
```

### Volume Backup

```bash
# Backup volume
docker run --rm -v flowmind_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_data.tar.gz /data

# Restore volume
docker run --rm -v flowmind_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_data.tar.gz -C /
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)
