# Real Estate Platform Database Migrations

This directory will contain the database migrations once they are generated.

## How to create initial migrations

1. Configure your `.env` file with the database URL
2. Run the migration command:
   ```bash
   npx prisma migrate dev --name init
   ```

This will create the initial migration files based on the schema.prisma file.

## Migration files

Migration files will be stored in this directory and should be committed to version control.