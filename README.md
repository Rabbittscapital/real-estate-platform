# Real Estate Platform 🏠

Full-stack real estate platform built with Next.js 14, Prisma, NextAuth, and TailwindCSS, designed for deployment on Vercel.

## Features

- **User Management**: Admin, Agent, and Client roles
- **Project Management**: Real estate development projects
- **Unit Management**: Individual properties and units
- **Quote System**: Price quotations for units
- **Reservation System**: Unit reservations with deposits
- **Client Profiles**: Detailed client information management

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (ready for configuration)
- **Styling**: TailwindCSS (ready for configuration)
- **Deployment**: Vercel

## Database Schema

The platform includes the following models:

### Core Models
- **Users**: Authentication and user management with roles (Admin, Agent, Client)
- **ClientProfiles**: Extended client information (address, contact details)
- **Projects**: Real estate development projects
- **Units**: Individual properties/units within projects
- **Quotes**: Price quotations for units
- **Reservations**: Unit reservations with deposits

### Key Features
- Role-based access control
- Project and unit management
- Quote generation and tracking
- Reservation system with expiry dates
- Comprehensive audit trails with created/updated timestamps

## Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (recommended: Neon)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd real-estate-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database URL:
   ```bash
   DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"
   ```

4. **Set up the database**
   ```bash
   ./setup-db.sh
   ```
   
   Or manually:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

## Database Configuration

### Using Neon (Recommended)

1. Create a new project at [neon.tech](https://neon.tech)
2. Get your connection string
3. Add it to your `.env` file:
   ```
   DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"
   ```

### Local PostgreSQL

1. Install PostgreSQL locally
2. Create a new database
3. Update your `.env` file with the local connection string

## Project Structure

```
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   └── lib/
│       └── prisma.ts          # Prisma client configuration
├── .env.example               # Environment variables template
├── setup-db.sh               # Database setup script
└── package.json               # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the ISC License.