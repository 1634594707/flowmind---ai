# TypeScript Configuration Guide

This document explains the TypeScript configuration strategy for the FlowMind monorepo.

## Configuration Hierarchy

```
tsconfig.base.json          # Base configuration (shared settings)
├── backend/tsconfig.json   # Backend-specific config
├── frontend/tsconfig.json  # Frontend-specific config
└── shared/tsconfig.json    # Shared package config
```

## Base Configuration (`tsconfig.base.json`)

The base configuration defines common settings used across all packages:

### Compiler Options

- **target**: `ES2021` - Modern JavaScript features
- **module**: `commonjs` - Node.js compatibility
- **strict**: `true` - Enable all strict type checking options
- **esModuleInterop**: `true` - Better CommonJS/ES module interop
- **experimentalDecorators**: `true` - Required for NestJS decorators
- **emitDecoratorMetadata**: `true` - Required for NestJS dependency injection

### Strict Mode Features

When `strict: true` is enabled, the following options are automatically enabled:

- `strictNullChecks` - Null and undefined are not assignable to other types
- `strictFunctionTypes` - Function parameter types are checked contravariantly
- `strictBindCallApply` - Strict checking of bind, call, and apply methods
- `strictPropertyInitialization` - Class properties must be initialized
- `noImplicitThis` - Error on 'this' expressions with an implied 'any' type
- `alwaysStrict` - Parse in strict mode and emit "use strict"

### Additional Strict Options

- `noUnusedLocals`: `true` - Report errors on unused local variables
- `noUnusedParameters`: `true` - Report errors on unused parameters
- `noImplicitReturns`: `true` - Report error when not all code paths return a value
- `noFallthroughCasesInSwitch`: `true` - Report errors for fallthrough cases in switch

## Package-Specific Configurations

### Backend (`backend/tsconfig.json`)

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "./dist",
    "baseUrl": "./",
    "rootDir": "./src",
    "paths": {
      "@/*": ["src/*"],
      "@shared/*": ["../shared/src/*"]
    }
  }
}
```

**Key Features:**

- Extends base configuration
- CommonJS modules for Node.js
- Path aliases for clean imports
- Access to shared package via `@shared/*`

### Frontend (`frontend/tsconfig.json`)

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "noEmit": true,
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../shared/src/*"]
    }
  }
}
```

**Key Features:**

- ESNext modules for modern bundlers (Vite)
- DOM types for browser APIs
- React JSX support
- No emit (Vite handles compilation)
- Path aliases including shared package

### Shared (`shared/tsconfig.json`)

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**Key Features:**

- Pure TypeScript library
- Compiled to CommonJS for compatibility
- Type declarations generated

## Path Aliases

All packages support path aliases for cleaner imports:

### Local Package Imports

```typescript
// Instead of:
import { UserService } from '../../../services/user.service';

// Use:
import { UserService } from '@/services/user.service';
```

### Shared Package Imports

```typescript
// Backend
import { UserRole, AgentRole } from '@shared/types';
import { isValidEmail } from '@shared/utils';

// Frontend
import { TaskStatus, Priority } from '@shared/types';
import { formatDate } from '@shared/utils';
```

## IDE Configuration

### VS Code

Create `.vscode/settings.json`:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### WebStorm/IntelliJ

1. Go to Settings → Languages & Frameworks → TypeScript
2. Select TypeScript version from `node_modules`
3. Enable "Use tsconfig.json"
4. Enable "Recompile on changes"

## Common Issues and Solutions

### Issue: Path aliases not working

**Solution:**

1. Ensure `tsconfig.json` extends `tsconfig.base.json`
2. Check that `baseUrl` is set correctly
3. Restart your IDE/editor
4. For Vite (frontend), ensure `vite.config.ts` has matching aliases

### Issue: Shared package types not found

**Solution:**

1. Build the shared package first:
   ```bash
   cd shared && npm run build
   ```
2. Or use watch mode during development:
   ```bash
   cd shared && npm run watch
   ```

### Issue: Decorator errors in backend

**Solution:**
Ensure these options are enabled in `tsconfig.json`:

```json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true
}
```

### Issue: Strict mode errors

**Solution:**
The base config enables strict mode. To fix errors:

1. **Null/undefined errors:**

   ```typescript
   // Bad
   let user: User;
   user.name; // Error: user might be undefined

   // Good
   let user: User | null = null;
   if (user) {
     user.name; // OK
   }
   ```

2. **Implicit any:**

   ```typescript
   // Bad
   function process(data) {} // Error: implicit any

   // Good
   function process(data: unknown) {}
   ```

3. **Unused variables:**

   ```typescript
   // Bad
   function example(a, b) {
     return a;
   } // Error: b is unused

   // Good
   function example(a: number, _b: number) {
     return a;
   }
   // Or remove unused parameter
   function example(a: number) {
     return a;
   }
   ```

## Type Checking in CI/CD

Add type checking to your CI pipeline:

```yaml
# .github/workflows/ci.yml
- name: Type Check
  run: |
    npm run build:shared
    cd backend && npx tsc --noEmit
    cd ../frontend && npx tsc --noEmit
```

## Best Practices

### 1. Use Strict Mode

Keep strict mode enabled. It catches bugs early and improves code quality.

### 2. Define Explicit Types

```typescript
// Bad
const users = [];

// Good
const users: User[] = [];
```

### 3. Use Type Guards

```typescript
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj;
}

if (isUser(data)) {
  // TypeScript knows data is User here
  console.log(data.id);
}
```

### 4. Leverage Shared Types

Put common types in the shared package:

```typescript
// shared/src/types/user.ts
export interface User {
  id: string;
  email: string;
  role: UserRole;
}

// Use in backend
import { User } from '@shared/types';

// Use in frontend
import { User } from '@shared/types';
```

### 5. Use Utility Types

```typescript
// Pick specific properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties required
type RequiredUser = Required<User>;

// Omit specific properties
type UserWithoutPassword = Omit<User, 'password'>;
```

### 6. Document Complex Types

```typescript
/**
 * Represents a task in the system
 * @property id - Unique identifier
 * @property status - Current task status
 * @property assigneeId - ID of assigned user (optional)
 */
export interface Task {
  id: string;
  status: TaskStatus;
  assigneeId?: string;
}
```

## Migration Guide

If you're migrating from loose TypeScript settings:

### Step 1: Enable Strict Mode Gradually

```json
{
  "compilerOptions": {
    "strict": false,
    "strictNullChecks": true // Enable one at a time
    // ... enable others gradually
  }
}
```

### Step 2: Fix Errors Package by Package

1. Start with the shared package (smallest)
2. Then backend
3. Finally frontend

### Step 3: Use `@ts-expect-error` Temporarily

```typescript
// @ts-expect-error - TODO: Fix this type error
const result = legacyFunction();
```

### Step 4: Remove Temporary Ignores

Search for `@ts-expect-error` and fix them one by one.

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Effective TypeScript](https://effectivetypescript.com/)
