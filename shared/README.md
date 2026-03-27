# FlowMind Shared Package

This package contains shared types, interfaces, constants, and utility functions used across the FlowMind monorepo.

## Structure

```
shared/
├── src/
│   ├── types/       # Shared TypeScript types and interfaces
│   ├── utils/       # Common utility functions
│   ├── constants/   # Application constants
│   └── index.ts     # Main export file
├── dist/            # Compiled output (generated)
└── package.json
```

## Usage

### In Backend

```typescript
import { UserRole, AgentRole, ApiResponse } from 'flowmind-shared';
import { isValidEmail } from 'flowmind-shared';
```

### In Frontend

```typescript
import { UserRole, TaskStatus, Priority } from 'flowmind-shared';
import { formatDate } from 'flowmind-shared';
```

## Development

```bash
# Build the package
npm run build

# Watch for changes
npm run watch

# Lint code
npm run lint

# Format code
npm run format
```

## Adding New Exports

1. Add your types/utils/constants to the appropriate directory
2. Export them from the directory's `index.ts`
3. Ensure they're re-exported from `src/index.ts`
4. Run `npm run build` to compile
