# FlowMind Quick Start Guide

Get up and running with FlowMind development in minutes.

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Git
- Docker (optional, for database)

## Initial Setup

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd FlowMind---AI

# Run the setup script (installs dependencies, builds shared package, sets up git hooks)
npm run setup
```

The setup script will:

- ✓ Check Node.js version
- ✓ Install all dependencies
- ✓ Initialize Husky git hooks
- ✓ Build the shared package
- ✓ Verify the setup

### 2. Environment Configuration

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your configuration
```

### 3. Start Development

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Frontend only (http://localhost:5173)
npm run dev:backend   # Backend only (http://localhost:3000)
```

## Project Structure

```
FlowMind---AI/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
├── backend/           # NestJS + TypeScript
│   ├── src/
│   │   ├── modules/
│   │   ├── common/
│   │   └── config/
│   └── package.json
│
├── shared/            # Shared types and utilities
│   ├── src/
│   │   ├── types/
│   │   ├── utils/
│   │   └── constants/
│   └── package.json
│
└── package.json       # Root workspace configuration
```

## Common Commands

### Development

```bash
npm run dev              # Start all services
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
```

### Building

```bash
npm run build            # Build all packages
npm run build:shared     # Build shared package
npm run build:frontend   # Build frontend
npm run build:backend    # Build backend
```

### Testing

```bash
npm test                 # Run all tests
npm run test:frontend    # Test frontend
npm run test:backend     # Test backend
```

### Code Quality

```bash
npm run lint             # Lint all packages
npm run format           # Format all files
```

### Database

```bash
npm run docker:up        # Start PostgreSQL and Redis
npm run db:migrate       # Run migrations
npm run db:seed          # Seed test data
npm run docker:down      # Stop containers
```

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feat/your-feature-name
```

### 2. Make Your Changes

Edit files in the appropriate package:

- Frontend changes: `frontend/src/`
- Backend changes: `backend/src/`
- Shared code: `shared/src/`

### 3. Use Path Aliases

```typescript
// ✓ Good - Use path aliases
import { UserService } from '@/services/user.service';
import { UserRole } from '@shared/types';

// ✗ Bad - Avoid relative paths
import { UserService } from '../../../services/user.service';
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat(component): add new feature"
```

Commit messages must follow the format: `type(scope): description`

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
git commit -m "feat(auth): add JWT authentication"
git commit -m "fix(api): resolve CORS issue"
git commit -m "docs(readme): update installation steps"
```

### 5. Pre-commit Hooks

Git hooks will automatically:

- ✓ Lint your staged files
- ✓ Format your code
- ✓ Validate commit message format

## Working with Shared Package

### Adding Shared Code

1. Add your code to `shared/src/`:

```typescript
// shared/src/types/task.ts
export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}
```

2. Export from index:

```typescript
// shared/src/types/index.ts
export * from './task';
```

3. Build the shared package:

```bash
cd shared && npm run build
```

4. Use in other packages:

```typescript
// In backend or frontend
import { Task } from '@shared/types';
```

### Development Tip

Run shared package in watch mode while developing:

```bash
cd shared && npm run watch
```

This automatically rebuilds when you make changes.

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000 (backend)
npx kill-port 3000

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

### TypeScript Errors

```bash
# Rebuild shared package
cd shared && npm run build

# Restart your IDE
```

### Dependency Issues

```bash
# Clean install
rm -rf node_modules package-lock.json
rm -rf */node_modules */package-lock.json
npm install
```

### Git Hooks Not Working

```bash
# Reinstall Husky
npm run prepare

# Make hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

## IDE Setup

### VS Code (Recommended)

Install extensions:

- ESLint
- Prettier
- TypeScript and JavaScript Language Features

Settings will be automatically applied from `.vscode/settings.json`.

### WebStorm/IntelliJ

1. Enable ESLint: Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
2. Enable Prettier: Settings → Languages & Frameworks → JavaScript → Prettier
3. Set TypeScript version: Settings → Languages & Frameworks → TypeScript → Use TypeScript from node_modules

## Next Steps

- 📖 Read [MONOREPO_SETUP.md](./MONOREPO_SETUP.md) for detailed monorepo documentation
- 📖 Read [TYPESCRIPT_CONFIG.md](./TYPESCRIPT_CONFIG.md) for TypeScript configuration details
- 📖 Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for architecture overview
- 🔍 Explore the codebase and start contributing!

## Getting Help

- Check existing documentation in the repository
- Review code comments and examples
- Ask team members for guidance
- Create an issue for bugs or feature requests

## Useful Links

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)
