# Authentication Entities

This directory contains the entity definitions for the authentication system.

## Session Entity

The `Session` entity manages JWT token sessions for authenticated users.

### Features

- **Token Management**: Stores JWT tokens with expiration tracking
- **User Association**: Links sessions to users with CASCADE delete
- **Expiration Checking**: Built-in method to check if session is expired
- **Indexed Lookups**: Optimized queries on userId and token fields

### Schema

```typescript
{
  id: string; // UUID primary key
  userId: string; // Foreign key to users table
  token: string; // JWT token
  expiresAt: Date; // Token expiration timestamp
  createdAt: Date; // Session creation timestamp
}
```

### Usage Example

```typescript
import { Session } from './entities/session.entity';

// Create a new session
const session = new Session();
session.userId = user.id;
session.token = jwtToken;
session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

await sessionRepository.save(session);

// Check if session is expired
if (session.isExpired()) {
  // Handle expired session
}
```

## Related Entities

- **User Entity**: Located in `modules/users/entities/user.entity.ts`
  - Enhanced with password hashing
  - Password complexity validation
  - Two-factor authentication support
  - Active status tracking
  - Last login timestamp

## Requirements

- **9.1**: JWT authentication with session tracking
- **9.4**: Password complexity requirements (minimum 8 characters, mixed case, numbers, symbols)
