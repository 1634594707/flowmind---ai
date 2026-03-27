# FlowMind Testing Guide

## Overview

FlowMind uses a comprehensive testing strategy combining unit tests and property-based tests to ensure code quality and correctness.

## Testing Stack

### Backend (NestJS)

- **Test Framework**: Jest
- **Property-Based Testing**: fast-check
- **E2E Testing**: Supertest
- **Coverage Target**: 80%

### Frontend (React)

- **Test Framework**: Vitest
- **Testing Library**: React Testing Library
- **Property-Based Testing**: fast-check
- **Coverage Target**: 80%

### Shared Package

- **Test Framework**: Jest
- **Property-Based Testing**: fast-check
- **Coverage Target**: 80%

## Running Tests

### All Packages

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Backend Tests

```bash
# Run backend tests
pnpm test:backend

# Watch mode
pnpm --filter flowmind-backend test:watch

# Coverage
pnpm --filter flowmind-backend test:cov

# E2E tests
pnpm --filter flowmind-backend test:e2e
```

### Frontend Tests

```bash
# Run frontend tests
pnpm test:frontend

# Watch mode
pnpm --filter flowmind-frontend test:watch

# Coverage
pnpm --filter flowmind-frontend test:coverage
```

### Shared Package Tests

```bash
# Run shared tests
pnpm test:shared

# Watch mode
pnpm --filter flowmind-shared test:watch

# Coverage
pnpm --filter flowmind-shared test:coverage
```

## Test Structure

### Backend Test Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.service.spec.ts        # Unit tests
│   │   │   └── auth.service.pbt.spec.ts    # Property-based tests
│   │   └── ...
│   └── ...
└── test/
    ├── app.e2e-spec.ts                      # E2E tests
    └── jest-e2e.json
```

### Frontend Test Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx              # Component tests
│   │   │   └── Button.pbt.test.tsx          # Property-based tests
│   │   └── ...
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useAuth.test.ts
│   └── test/
│       ├── setup.ts
│       └── utils.tsx
```

## Writing Unit Tests

### Backend Unit Test Example

```typescript
// auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validatePassword', () => {
    it('should reject passwords shorter than 8 characters', async () => {
      await expect(service.validatePassword('short')).rejects.toThrow();
    });

    it('should accept valid passwords', async () => {
      const result = await service.validatePassword('ValidPass123!');
      expect(result).toBe(true);
    });
  });
});
```

### Frontend Unit Test Example

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

## Writing Property-Based Tests

Property-based tests verify that properties hold for all possible inputs, not just specific examples.

### Backend Property-Based Test Example

```typescript
// auth.service.pbt.spec.ts
import * as fc from 'fast-check';
import { AuthService } from './auth.service';

describe('AuthService - Property-Based Tests', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
  });

  // Feature: flowmind-feature-enhancement, Property 57: Password Complexity Enforcement
  it('should reject all passwords not meeting complexity requirements', async () => {
    await fc.assert(
      fc.asyncProperty(fc.string({ minLength: 1, maxLength: 100 }), async password => {
        const hasMinLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*]/.test(password);

        const meetsRequirements =
          hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial;

        if (meetsRequirements) {
          await expect(service.validatePassword(password)).resolves.toBe(true);
        } else {
          await expect(service.validatePassword(password)).rejects.toThrow();
        }
      }),
      { numRuns: 100 }
    );
  });

  // Feature: flowmind-feature-enhancement, Property 1: Agent Creation and Retrieval
  it('should retrieve created agents with same configuration', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          projectId: fc.uuid(),
          role: fc.constantFrom('requirements_analyst', 'architect', 'developer', 'tester'),
          name: fc.string({ minLength: 1, maxLength: 50 }),
          temperature: fc.float({ min: 0, max: 1 }),
        }),
        async config => {
          const created = await service.createAgent(config);
          const retrieved = await service.getAgent(created.id);

          expect(retrieved.role).toBe(config.role);
          expect(retrieved.name).toBe(config.name);
          expect(retrieved.temperature).toBe(config.temperature);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Frontend Property-Based Test Example

```typescript
// Button.pbt.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { Button } from './Button';

describe('Button - Property-Based Tests', () => {
  it('always renders the provided text', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (text) => {
          render(<Button>{text}</Button>);
          expect(screen.getByText(text)).toBeInTheDocument();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('calls onClick exactly once per click', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        (clickCount) => {
          const handleClick = vi.fn();
          render(<Button onClick={handleClick}>Click</Button>);

          const button = screen.getByText('Click');
          for (let i = 0; i < clickCount; i++) {
            fireEvent.click(button);
          }

          expect(handleClick).toHaveBeenCalledTimes(clickCount);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

## Property-Based Testing Guidelines

### 1. Property Naming Convention

All property tests must include a comment with:

- Feature name: `flowmind-feature-enhancement`
- Property number and description from design document

Example:

```typescript
// Feature: flowmind-feature-enhancement, Property 8: Message Delivery Completeness
it('should deliver messages to all channel members', async () => {
  // test implementation
});
```

### 2. Minimum Iterations

Each property test must run at least 100 iterations:

```typescript
fc.assert(
  fc.property(...),
  { numRuns: 100 }
);
```

### 3. Generators

Use appropriate fast-check generators:

- `fc.string()` - Random strings
- `fc.integer()` - Random integers
- `fc.float()` - Random floats
- `fc.uuid()` - UUIDs
- `fc.array()` - Arrays
- `fc.record()` - Objects
- `fc.constantFrom()` - Enum values

### 4. Property Categories

- **Round-trip properties**: Serialize/deserialize should preserve data
- **Invariant properties**: Certain conditions always hold
- **Idempotence properties**: Applying operation twice = applying once
- **Commutativity properties**: Order doesn't matter
- **Associativity properties**: Grouping doesn't matter

## E2E Testing

### Backend E2E Test Example

```typescript
// app.e2e-spec.ts
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('accessToken');
      });
  });
});
```

## Test Coverage

### Viewing Coverage Reports

```bash
# Generate coverage report
pnpm test:coverage

# View HTML report
# Backend: open backend/coverage/index.html
# Frontend: open frontend/coverage/index.html
# Shared: open shared/coverage/index.html
```

### Coverage Thresholds

All packages enforce 80% coverage for:

- Lines
- Functions
- Branches
- Statements

### Excluding Files from Coverage

Files excluded from coverage:

- Test files (`*.spec.ts`, `*.test.ts`)
- Type definitions (`*.d.ts`)
- Configuration files
- Entry points (`main.ts`, `index.ts`)
- DTOs and entities (backend)

## Mocking

### Backend Mocking

```typescript
// Mock repository
const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

// Mock service
const mockService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};
```

### Frontend Mocking

```typescript
// Mock API calls
vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock hooks
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Test User' },
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));
```

## Best Practices

### 1. Test Organization

- Group related tests with `describe` blocks
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert

### 2. Test Independence

- Each test should be independent
- Use `beforeEach` for setup
- Use `afterEach` for cleanup
- Don't rely on test execution order

### 3. Test Data

- Use factories or builders for test data
- Keep test data minimal and focused
- Use meaningful test data names

### 4. Assertions

- One logical assertion per test
- Use specific matchers
- Test both success and failure cases

### 5. Performance

- Keep tests fast (< 100ms per test)
- Mock external dependencies
- Use in-memory databases for integration tests

### 6. Maintenance

- Update tests when code changes
- Remove obsolete tests
- Keep tests simple and readable

## Continuous Integration

Tests run automatically on:

- Pre-commit (via Husky)
- Pull requests
- Main branch pushes

### CI Configuration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm test:coverage
```

## Debugging Tests

### Backend

```bash
# Debug single test
node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand auth.service.spec.ts

# VS Code launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "${file}"],
  "console": "integratedTerminal"
}
```

### Frontend

```bash
# Debug with Vitest UI
pnpm --filter flowmind-frontend test --ui

# Debug in VS Code
{
  "type": "node",
  "request": "launch",
  "name": "Vitest Debug",
  "runtimeExecutable": "pnpm",
  "runtimeArgs": ["test", "--run"],
  "console": "integratedTerminal"
}
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [fast-check Documentation](https://fast-check.dev/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
