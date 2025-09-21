# Real Estate Platform

Full-stack real estate platform built with Next.js 14, Prisma, NextAuth, and TailwindCSS, designed for deployment on Vercel. Features a comprehensive Role-Based Access Control (RBAC) system for secure multi-user access.

## Features

### 🔐 Role-Based Access Control (RBAC)
- **Three User Roles**: Administrator, Agent, and User
- **Granular Permissions**: Resource and action-based permission system
- **Multi-Layer Protection**: Route middleware, component guards, and API validation
- **NextAuth.js Integration**: Secure authentication with role/permission embedding

### 🏠 Real Estate Management
- Property listing management (Create, Read, Update, Delete)
- Project management for real estate developments
- Client and lead management
- Sales reporting and analytics

### 🛡️ Security Features
- JWT-based session management
- Server-side route protection via middleware
- Component-level access control
- Type-safe permission checking
- Secure password hashing with bcrypt

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 (beta)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel-ready

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rabbittscapital/real-estate-platform.git
   cd real-estate-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database and authentication settings:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/real_estate_platform"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Optional: OAuth providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to see the application.

## User Roles and Permissions

### 👨‍💼 Administrator
- Full system access
- User management (create, edit, delete users)
- Role and permission management
- Access to all reports and analytics
- Complete project and property management

### 🏘️ Agent
- Property listing management (CRUD)
- Project management (CRUD)
- Sales and analytics reports
- Client information access
- Limited user viewing permissions

### 👤 User
- Property viewing and searching
- Profile management
- Favorites and saved searches
- Contact agents for inquiries

## Demo Accounts

After running the seed script, you can use these demo accounts:

- **Administrator**: admin@example.com / admin123
- **Agent**: agent@example.com / agent123
- **User**: user@example.com / user123

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin-only pages
│   ├── agent/             # Agent-accessible pages
│   ├── auth/              # Authentication pages
│   └── api/               # API routes
├── components/
│   └── auth/              # RBAC components (HOCs, guards)
├── hooks/                 # Custom React hooks for permissions
├── lib/                   # Core utilities
│   ├── auth.ts           # NextAuth.js configuration
│   ├── db.ts             # Prisma database connection
│   └── permissions.ts     # Permission checking utilities
├── middleware.ts          # Route protection middleware
└── types/                 # TypeScript type definitions

prisma/
├── schema.prisma          # Database schema
└── seed.ts               # Database seeding script

docs/
└── RBAC.md               # Comprehensive RBAC documentation
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio

### RBAC Development Guide

For detailed information on implementing and extending the Role-Based Access Control system, see [docs/RBAC.md](./docs/RBAC.md).

Key concepts:
- **Route Protection**: Use middleware to protect entire route segments
- **Component Guards**: Use HOCs like `<WithPermission>` for conditional rendering
- **Permission Hooks**: Use `usePermissions()` for dynamic permission checking
- **Utility Functions**: Use helper functions for server-side permission validation

## Deployment

### Vercel Deployment

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Configure database** (recommend PlanetScale or Supabase for production)
4. **Deploy** - Vercel will automatically build and deploy

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

## Security Best Practices

1. **Environment Variables**: Never commit secrets to version control
2. **Database Security**: Use connection pooling and read replicas for production
3. **Authentication**: Implement strong password policies and 2FA where needed
4. **Authorization**: Always validate permissions on both client and server
5. **Audit Logging**: Implement user action logging for sensitive operations

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions and support:
- 📖 Check the [RBAC Documentation](./docs/RBAC.md)
- 🐛 Open an [issue](https://github.com/Rabbittscapital/real-estate-platform/issues) for bug reports
- 💡 Start a [discussion](https://github.com/Rabbittscapital/real-estate-platform/discussions) for feature requests

---

Built with ❤️ using Next.js, Prisma, and NextAuth.js
