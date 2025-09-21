#!/bin/bash

# Real Estate Platform - Database Setup Script
# This script helps set up the database and run initial migrations

echo "🏠 Real Estate Platform - Database Setup"
echo "========================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📋 Please copy .env.example to .env and configure your database URL"
    echo "   cp .env.example .env"
    echo ""
    echo "🔧 Configure your Neon PostgreSQL URL in .env:"
    echo "   DATABASE_URL='postgresql://username:password@hostname:port/database?sslmode=require'"
    exit 1
fi

echo "✅ .env file found"

# Generate Prisma Client
echo "🔄 Generating Prisma Client..."
npx prisma generate

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma db push

echo ""
echo "✅ Database setup complete!"
echo "🎯 You can now run 'npm run dev' to start the development server"
echo "📊 Use 'npm run db:studio' to open Prisma Studio and manage your data"