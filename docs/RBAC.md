# Role-Based Access Control (RBAC) Documentation

## Overview

This real estate platform implements a comprehensive Role-Based Access Control (RBAC) system using NextAuth.js v5, Prisma, and a custom permission framework. The system provides granular control over user access to resources and actions throughout the application.

## Architecture

### Database Schema

The RBAC system is built on four core models:

1. **User** - Stores user information and authentication data
2. **Role** - Defines user roles (Administrator, Agent, User)
3. **Permission** - Granular permissions for specific actions
4. **Junction Tables** - UserRole and RolePermission for many-to-many relationships

### Key Components

- **NextAuth.js Integration** - Handles authentication with role/permission embedding
- **Middleware Protection** - Route-level access control
- **React Hooks** - Component-level permission checking
- **HOCs** - Conditional component rendering
- **Utility Functions** - Centralized permission logic

## Roles and Permissions

### Default Roles

#### Administrator
- **Full System Access**
- User management (CRUD)
- Role and permission management
- Access to all reports and analytics
- Project and property management

#### Agent
- **Real Estate Operations**
- Property listing management (CRUD)
- Project management (CRUD)
- Sales and analytics reports
- Client information access

#### User
- **Basic Access**
- Property viewing
- Profile management
- Favorites and saved searches

### Permission Structure

Permissions follow the format: `resource:action`

Examples:
- `user:create` - Create new users
- `property:read` - View properties
- `report:sales` - Access sales reports

## Implementation Guide

### 1. Setting Up Authentication

The NextAuth.js configuration in `src/lib/auth.ts` handles:
- JWT session strategy
- Role and permission embedding in tokens
- Multiple authentication providers

```typescript
// Example: Checking user permissions in a session
const session = await auth()
if (session?.user?.permissions?.includes('admin:read')) {
  // User has admin read access
}
```

### 2. Route Protection

Middleware (`src/middleware.ts`) automatically protects routes based on configuration:

```typescript
const protectedRoutes = {
  '/admin': {
    roles: ['administrator'],
    requireAuth: true,
  },
  '/agent': {
    roles: ['agent', 'administrator'], 
    requireAuth: true,
  }
}
```

### 3. Component-Level Protection

Use React hooks for permission checking:

```tsx
import { usePermissions } from '@/hooks/usePermissions'

function MyComponent() {
  const { hasPermission, isAdmin } = usePermissions()
  
  return (
    <div>
      {hasPermission('user:create') && (
        <button>Create User</button>
      )}
      {isAdmin() && (
        <AdminPanel />
      )}
    </div>
  )
}
```

### 4. Higher-Order Components

Use HOCs for conditional rendering:

```tsx
import { WithPermission, WithAdminRole } from '@/components/auth/ProtectedComponents'

function Dashboard() {
  return (
    <div>
      <WithPermission permission="report:read">
        <ReportsSection />
      </WithPermission>
      
      <WithAdminRole>
        <AdminControls />
      </WithAdminRole>
    </div>
  )
}
```

## API Reference

### Utility Functions

Located in `src/lib/permissions.ts`:

- `hasPermission(session, permission)` - Check single permission
- `hasAnyPermission(session, permissions)` - Check any of multiple permissions
- `hasRole(session, roleName)` - Check user role
- `isAdmin(session)` - Check if user is administrator
- `isAgent(session)` - Check if user is agent

### React Hooks

Located in `src/hooks/usePermissions.ts`:

- `usePermissions()` - Main hook with all permission checking functions
- `useHasPermission(permission)` - Check single permission
- `useHasRole(roleName)` - Check user role
- `useIsAdmin()` - Check admin status

### Protected Components

Located in `src/components/auth/ProtectedComponents.tsx`:

- `<WithAuth>` - Requires authentication
- `<WithPermission permission="...">` - Requires specific permission
- `<WithRole role="...">` - Requires specific role
- `<WithAdminRole>` - Requires administrator role

## Database Setup

### 1. Environment Configuration

Create a `.env` file with database connection:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/real_estate_platform"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Database Migration and Seeding

```bash
# Push database schema
npm run db:push

# Seed default roles and permissions
npm run db:seed
```

### 3. Default Accounts

The seed script creates demo accounts:

- **Admin:** admin@example.com / admin123
- **Agent:** agent@example.com / agent123  
- **User:** user@example.com / user123

## Security Considerations

1. **JWT Tokens** - Include roles/permissions for client-side checks
2. **Server-Side Validation** - Always validate permissions on API routes
3. **Middleware Protection** - First line of defense for route access
4. **Component Guards** - Prevent UI rendering without proper permissions
5. **Database Constraints** - Foreign key relationships ensure data integrity

## Extending the System

### Adding New Roles

1. Update the seed script (`prisma/seed.ts`)
2. Add role-specific permissions
3. Update middleware route configuration
4. Add any role-specific UI components

### Adding New Permissions

1. Define permission in seed script
2. Assign to appropriate roles
3. Update permission constants in `src/lib/permissions.ts`
4. Implement permission checks in components/API routes

### Custom Permission Logic

Create custom permission checking functions:

```typescript
// Custom business logic
export function canEditProperty(session: Session, propertyOwnerId: string): boolean {
  if (isAdmin(session)) return true
  if (isAgent(session) && session.user.id === propertyOwnerId) return true
  return false
}
```

## Testing

The system includes comprehensive protection at multiple levels:

1. **Route Level** - Middleware prevents unauthorized access
2. **Component Level** - HOCs and hooks control rendering
3. **API Level** - Server-side permission validation
4. **Database Level** - Schema constraints and relationships

Test with different user roles to ensure proper access control throughout the application.

## Deployment

Before deploying:

1. Set production environment variables
2. Configure production database
3. Run database migrations
4. Seed production data
5. Test all authentication flows
6. Verify permission enforcement

The system is designed to work seamlessly with Vercel deployment and PostgreSQL databases.