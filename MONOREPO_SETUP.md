# FlowMind Monorepo Setup Guide

This document describes the monorepo structure and configuration for the FlowMind project.

## Structure

```
FlowMind---AI/
├── frontend/          # React + TypeScript + Vite frontend
├── backend/           # NestJS + TypeScript backend
├── shared/            # Shared types, utilities, and constants
├── docker/            # Docker configurations
├── scripts/           # Build and deployment scripts
├── .husky/            # Git hooks
├── tsconfig.base.json # Base TypeScript configuration
├── package.json       # Root package with workspace configuration
└── docker-compose.yml # Docker Compose configuration
```

## Workspace Configuration

The project uses npm workspaces to manage multiple packages:

- **frontend**: React application with Vite
- **backend**: NestJS API server
- **shared**: Common code shared between frontend and backend

## TypeScript Configuration

### Base Configuration (`tsconfig.base.json`)

All packages extend from a base TypeScript configuration that enforces:

- Strict type checking
- ES2021 target
- Decorator support for NestJS
- Path aliases for clean imports

### Package-Specific Configurations

Each package has its own `tsconfig.json` that extends the base:

- **Backend**: CommonJS modules, Node.js environment
- **Frontend**: ESNext modules, DOM types, React JSX
- **Shared**: CommonJS modules for compatibility

### Path Aliases

All packages support path aliases:

```typescript
// Instead of: import { User } from '../../../models/user'
import { User } from '@/models/user';

// Access shared package
import { UserRole } from '@shared/types';
```

## Code Quality Tools

### ESLint

Each package has its own ESLint configuration:

- TypeScript-specific rules
- Prettier integration
- Package-specific plugins (React for frontend, NestJS for backend)

### Prettier

Unified code formatting across all packages:

- Single quotes
- 2-space indentation
- 100 character line width
- Trailing commas (ES5)

### Husky Git Hooks

Automated quality checks on git operations:

#### Pre-commit Hook

- Runs `lint-staged` to lint and format only staged files
- Ensures code quality before commits

#### Commit Message Hook

- Enforces conventional commit format
- Format: `type(scope): subject`
- Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert

Example valid commits:

```
feat(auth): add JWT authentication
fix(api): resolve CORS issue
docs(readme): update installation instructions
```

## Available Scripts

### Root Level

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend

# Building
npm run build            # Build all packages (shared, frontend, backend)
npm run build:shared     # Build shared package
npm run build:frontend   # Build frontend
npm run build:backend    # Build backend

# Testing
npm test                 # Run all tests
npm run test:shared      # Test shared package
npm run test:frontend    # Test frontend
npm run test:backend     # Test backend

# Linting & Formatting
npm run lint             # Lint all packages
npm run format           # Format all files

# Docker
npm run docker:up        # Start Docker containers
npm run docker:down      # Stop Docker containers
npm run docker:logs      # View Docker logs

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with test data
```

### Package-Specific

Navigate to any package directory and run:

```bash
cd frontend  # or backend, or shared
npm run dev
npm run build
npm test
npm run lint
```

## Development Workflow

### Initial Setup

1. Install dependencies:

```bash
npm install
```

2. Initialize Husky:

```bash
npm run prepare
```

3. Build shared package:

```bash
npm run build:shared
```

4. Start development servers:

```bash
npm run dev
```

### Adding New Shared Code

1. Add your code to `shared/src/`
2. Export from appropriate index file
3. Build the shared package:

```bash
cd shared && npm run build
```

4. Use in other packages:

```typescript
import { YourType } from 'flowmind-shared';
```

### Making Changes

1. Create a feature branch
2. Make your changes
3. Commit with conventional format:

```bash
git commit -m "feat(component): add new feature"
```

4. Pre-commit hooks will automatically:
   - Lint staged files
   - Format code
   - Validate commit message

### Adding Dependencies

```bash
# Root dependencies (build tools, etc.)
npm install -D <package> -w root

# Frontend dependencies
npm install <package> -w frontend

# Backend dependencies
npm install <package> -w backend

# Shared dependencies
npm install <package> -w shared
```

## Best Practices

### Import Order

1. External dependencies
2. Internal absolute imports (using @/)
3. Shared package imports (using @shared/)
4. Relative imports

```typescript
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { UserService } from '@/services/user.service';
import { UserRole } from '@shared/types';

import { validateUser } from './utils';
```

### Type Safety

- Always use TypeScript strict mode
- Define interfaces for all data structures
- Use shared types from the shared package
- Avoid `any` type unless absolutely necessary

### Code Organization

- Keep shared code in the `shared` package
- Use barrel exports (index.ts) for clean imports
- Follow package-specific conventions (NestJS modules, React components)

### Testing

- Write tests alongside your code
- Use `.spec.ts` suffix for test files
- Aim for high test coverage
- Test shared utilities thoroughly

## Troubleshooting

### TypeScript Path Aliases Not Working

1. Ensure `tsconfig.json` extends `tsconfig.base.json`
2. Check that paths are correctly configured
3. Restart your IDE/editor

### Shared Package Changes Not Reflected

1. Rebuild the shared package:

```bash
cd shared && npm run build
```

2. Or use watch mode during development:

```bash
cd shared && npm run watch
```

### Husky Hooks Not Running

1. Ensure Husky is installed:

```bash
npm run prepare
```

2. Check hook file permissions:

```bash
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Workspace Dependencies Issues

1. Clean install:

```bash
rm -rf node_modules package-lock.json
rm -rf */node_modules */package-lock.json
npm install
```

## CI/CD Integration

The monorepo structure supports CI/CD pipelines:

1. Install dependencies: `npm ci`
2. Build shared package: `npm run build:shared`
3. Run linting: `npm run lint`
4. Run tests: `npm test`
5. Build all packages: `npm run build`
6. Deploy as needed

## Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)
