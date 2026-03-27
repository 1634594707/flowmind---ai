# FlowMind Monorepo Guide

## Overview

FlowMind uses a monorepo structure managed by **pnpm workspaces**. This allows us to share code between frontend, backend, and shared packages while maintaining independent versioning and dependencies.

## Structure

```
flowmind/
├── frontend/          # React + TypeScript + Vite frontend
├── backend/           # NestJS + TypeScript backend
├── shared/            # Shared types and utilities
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.base.json
```

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0

Install pnpm globally:

```bash
npm install -g pnpm@8.15.1
```

## Installation

Install all dependencies for all packages:

```bash
pnpm install
```

## Development

### Run all services

```bash
pnpm dev
```

### Run individual services

```bash
# Frontend only
pnpm dev:frontend

# Backend only
pnpm dev:backend
```

## Building

### Build all packages

```bash
pnpm build
```

### Build individual packages

```bash
pnpm build:shared
pnpm build:frontend
pnpm build:backend
```

## Testing

### Run all tests

```bash
pnpm test
```

### Run tests for specific package

```bash
pnpm test:frontend
pnpm test:backend
pnpm test:shared
```

## Linting and Formatting

### Lint all packages

```bash
pnpm lint
```

### Format all code

```bash
pnpm format
```

## TypeScript Configuration

### Base Configuration

`tsconfig.base.json` contains shared TypeScript configuration for all packages.

### Path Aliases

- `@/*` - Maps to package's src directory
- `@shared/*` - Maps to shared package
- `@flowmind/shared` - Import shared package

### Example Usage

```typescript
// In backend
import { UserDto } from '@shared/types';
import { AuthService } from '@/modules/auth/auth.service';

// In frontend
import { ApiResponse } from '@shared/types';
import { useAuth } from '@/hooks/useAuth';
```

## Package Management

### Add dependency to specific package

```bash
# Add to frontend
pnpm --filter flowmind-frontend add axios

# Add to backend
pnpm --filter flowmind-backend add @nestjs/jwt

# Add to shared
pnpm --filter flowmind-shared add zod
```

### Add dev dependency

```bash
pnpm --filter flowmind-frontend add -D @types/node
```

### Add dependency to root (workspace tools)

```bash
pnpm add -D -w prettier
```

## Docker

### Start all services with Docker

```bash
pnpm docker:up
```

### Stop all services

```bash
pnpm docker:down
```

### View logs

```bash
pnpm docker:logs
```

## Database

### Run migrations

```bash
pnpm db:migrate
```

### Seed database

```bash
pnpm db:seed
```

## Git Hooks

Husky is configured to run linting and formatting on commit:

- Pre-commit: Runs lint-staged (ESLint + Prettier on staged files)
- Pre-push: Runs tests

## Workspace Commands

### Run command in all packages

```bash
pnpm -r <command>
```

### Run command in specific package

```bash
pnpm --filter <package-name> <command>
```

### Run command in multiple packages

```bash
pnpm --filter "{frontend,backend}" build
```

## Troubleshooting

### Clear all node_modules and reinstall

```bash
pnpm clean:all
pnpm install
```

### Clear pnpm cache

```bash
pnpm store prune
```

### Rebuild all packages

```bash
pnpm -r clean
pnpm build
```

## Best Practices

1. **Shared Code**: Put common types, utilities, and constants in the `shared` package
2. **Dependencies**: Add dependencies to the specific package that needs them
3. **TypeScript**: Use path aliases for cleaner imports
4. **Testing**: Write tests alongside your code
5. **Commits**: Follow conventional commit format
6. **Code Quality**: Run `pnpm lint` and `pnpm format` before committing

## Package Scripts Reference

### Root Level

- `pnpm dev` - Start all services in development mode
- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all packages
- `pnpm format` - Format all code

### Frontend

- `pnpm --filter flowmind-frontend dev` - Start Vite dev server
- `pnpm --filter flowmind-frontend build` - Build for production
- `pnpm --filter flowmind-frontend preview` - Preview production build

### Backend

- `pnpm --filter flowmind-backend start:dev` - Start NestJS in watch mode
- `pnpm --filter flowmind-backend build` - Build backend
- `pnpm --filter flowmind-backend test` - Run backend tests
- `pnpm --filter flowmind-backend test:e2e` - Run E2E tests

### Shared

- `pnpm --filter flowmind-shared build` - Build shared package
- `pnpm --filter flowmind-shared watch` - Watch mode for development
