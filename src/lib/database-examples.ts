import { prisma } from '@/lib/prisma'

// Example usage of the Prisma client
// This file demonstrates how to use the database models

export async function exampleDatabaseOperations() {
  try {
    // Example: Create a new user
    const newUser = await prisma.user.create({
      data: {
        email: 'example@realestate.com',
        name: 'John Doe',
        password: 'hashed_password_here', // In real app, use proper password hashing
        role: 'CLIENT',
        phone: '+1234567890'
      }
    })

    // Example: Create a client profile
    const clientProfile = await prisma.clientProfile.create({
      data: {
        userId: newUser.id,
        address: '123 Main St',
        city: 'Ciudad de México',
        state: 'CDMX',
        zipCode: '12345'
      }
    })

    // Example: Create a real estate project
    const project = await prisma.project.create({
      data: {
        name: 'Torre Residencial Vista Hermosa',
        description: 'Moderno desarrollo residencial con amenidades de lujo',
        address: 'Av. Reforma 456',
        city: 'Ciudad de México',
        state: 'CDMX',
        zipCode: '11000',
        status: 'CONSTRUCTION',
        totalUnits: 120
      }
    })

    // Example: Create units for the project
    const unit = await prisma.units.create({
      data: {
        projectId: project.id,
        unitNumber: 'A-101',
        floor: 1,
        bedrooms: 2,
        bathrooms: 2.0,
        area: 85.5, // square meters
        price: 2500000.00, // Mexican pesos
        status: 'AVAILABLE',
        description: 'Apartamento de 2 recámaras con vista al jardín'
      }
    })

    // Example: Create a quote
    const quote = await prisma.quote.create({
      data: {
        userId: newUser.id,
        projectId: project.id,
        unitId: unit.id,
        quoteNumber: 'COT-2024-001',
        basePrice: 2500000.00,
        discount: 50000.00,
        finalPrice: 2450000.00,
        status: 'PENDING',
        validUntil: new Date('2024-12-31'),
        notes: 'Descuento por pronto pago'
      }
    })

    // Example: Create a reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId: newUser.id,
        unitId: unit.id,
        quoteId: quote.id,
        expiryDate: new Date('2024-06-30'),
        depositAmount: 50000.00,
        status: 'PENDING',
        notes: 'Apartado con enganche inicial'
      }
    })

    console.log('Database operations completed successfully!')
    return {
      user: newUser,
      profile: clientProfile,
      project,
      unit,
      quote,
      reservation
    }

  } catch (error) {
    console.error('Database operation failed:', error)
    throw error
  }
}

// Example: Fetch data with relationships
export async function fetchUserWithRelatedData(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      clientProfile: true,
      quotes: {
        include: {
          project: true,
          unit: true
        }
      },
      reservations: {
        include: {
          unit: {
            include: {
              project: true
            }
          }
        }
      }
    }
  })
}

// Example: Search available units
export async function searchAvailableUnits(filters: {
  projectId?: string
  minBedrooms?: number
  maxPrice?: number
  city?: string
}) {
  return await prisma.units.findMany({
    where: {
      status: 'AVAILABLE',
      ...(filters.projectId && { projectId: filters.projectId }),
      ...(filters.minBedrooms && { bedrooms: { gte: filters.minBedrooms } }),
      ...(filters.maxPrice && { price: { lte: filters.maxPrice } }),
      ...(filters.city && {
        project: {
          city: filters.city
        }
      })
    },
    include: {
      project: true
    },
    orderBy: {
      price: 'asc'
    }
  })
}