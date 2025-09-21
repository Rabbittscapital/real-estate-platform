import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    // Clear existing data
    await prisma.$transaction([
      prisma.reservation.deleteMany(),
      prisma.quote.deleteMany(),
      prisma.unit.deleteMany(),
      prisma.project.deleteMany(),
      prisma.client.deleteMany(),
      prisma.session.deleteMany(),
      prisma.account.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@realestate.com',
        password: adminPassword,
        role: 'ADMIN' as const,
      },
    });

    // Create agent user
    const agentPassword = await bcrypt.hash('agent123', 12);
    const agent = await prisma.user.create({
      data: {
        name: 'Real Estate Agent',
        email: 'agent@realestate.com',
        password: agentPassword,
        role: 'AGENT' as const,
      },
    });

    // Create demo projects
    const project1 = await prisma.project.create({
      data: {
        name: 'Torres del Pacífico',
        description: 'Exclusivo proyecto residencial con vista al mar en Viña del Mar',
        location: 'Viña del Mar, Chile',
        developer: 'Inmobiliaria Pacífico',
        totalUnits: 120,
        availableUnits: 95,
        startingPrice: 2500000,
        endingPrice: 4500000,
        deliveryDate: new Date('2025-06-30'),
        status: "UNDER_CONSTRUCTION" as const,
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
        ],
        amenities: [
          'Piscina',
          'Gimnasio',
          'Sala de eventos',
          'Estacionamiento',
          'Seguridad 24/7'
        ],
      },
    });

    const project2 = await prisma.project.create({
      data: {
        name: 'Residencial Los Andes',
        description: 'Proyecto familiar en el corazón de Las Condes',
        location: 'Las Condes, Santiago',
        developer: 'Constructora Andina',
        totalUnits: 80,
        availableUnits: 45,
        startingPrice: 3200000,
        endingPrice: 5800000,
        deliveryDate: new Date('2024-12-15'),
        status: "UNDER_CONSTRUCTION" as const,
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
          'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800'
        ],
        amenities: [
          'Quincho',
          'Juegos infantiles',
          'Estacionamiento de visitas',
          'Bodega',
          'Conserje'
        ],
      },
    });

    // Create demo units for project 1
    const unitsProject1 = [];
    for (let i = 1; i <= 20; i++) {
      const floor = Math.ceil(i / 4);
      const unitNumber = `${floor}0${((i - 1) % 4) + 1}`;
      unitsProject1.push({
        projectId: project1.id,
        unitNumber,
        type: i <= 16 ? "APARTMENT" as const : "PENTHOUSE" as const,
        bedrooms: i <= 8 ? 2 : i <= 16 ? 3 : 4,
        bathrooms: i <= 8 ? 1.5 : i <= 16 ? 2 : 3.5,
        area: i <= 8 ? 65.5 : i <= 16 ? 85.0 : 120.0,
        price: i <= 8 ? 2500000 : i <= 16 ? 3200000 : 4500000,
        floor,
        orientation: ['Norte', 'Sur', 'Este', 'Oeste'][i % 4],
        balcony: true,
        parking: true,
        storage: i > 8,
        status: i <= 5 ? "SOLD" as const : i <= 15 ? "AVAILABLE" as const : "RESERVED" as const,
        features: i <= 8 ? ['Cocina equipada', 'Closets'] : 
                  i <= 16 ? ['Cocina equipada', 'Closets', 'Terraza'] :
                  ['Cocina equipada', 'Closets', 'Terraza', 'Jacuzzi', 'Walk-in closet'],
      });
    }

    await prisma.unit.createMany({
      data: unitsProject1,
    });

    // Create demo units for project 2
    const unitsProject2 = [];
    for (let i = 1; i <= 15; i++) {
      const floor = Math.ceil(i / 3);
      const unitNumber = `${floor}0${((i - 1) % 3) + 1}`;
      unitsProject2.push({
        projectId: project2.id,
        unitNumber,
        type: i <= 12 ? "APARTMENT" as const : "PENTHOUSE" as const,
        bedrooms: i <= 6 ? 2 : i <= 12 ? 3 : 4,
        bathrooms: i <= 6 ? 2 : i <= 12 ? 2.5 : 3,
        area: i <= 6 ? 75.0 : i <= 12 ? 95.0 : 140.0,
        price: i <= 6 ? 3200000 : i <= 12 ? 4200000 : 5800000,
        floor,
        orientation: ['Norte', 'Sur', 'Este'][i % 3],
        balcony: true,
        parking: true,
        storage: true,
        status: i <= 3 ? "SOLD" as const : i <= 12 ? "AVAILABLE" as const : "RESERVED" as const,
        features: i <= 6 ? ['Cocina equipada', 'Closets', 'Bodega'] : 
                  i <= 12 ? ['Cocina equipada', 'Closets', 'Bodega', 'Terraza'] :
                  ['Cocina equipada', 'Closets', 'Bodega', 'Terraza', 'Jacuzzi', 'Vista panorámica'],
      });
    }

    await prisma.unit.createMany({
      data: unitsProject2,
    });

    // Create demo clients
    const client1 = await prisma.client.create({
      data: {
        userId: admin.id,
        firstName: 'María',
        lastName: 'González',
        email: 'maria.gonzalez@email.com',
        phone: '+56912345678',
        address: 'Av. Providencia 1234',
        city: 'Santiago',
        country: 'Chile',
        occupation: 'Ingeniera',
        income: 2500000,
        budget: 3500000,
        notes: 'Interesada en departamentos de 2-3 dormitorios',
      },
    });

    const client2 = await prisma.client.create({
      data: {
        userId: agent.id,
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        email: 'carlos.rodriguez@email.com',
        phone: '+56987654321',
        address: 'Las Condes 5678',
        city: 'Santiago',
        country: 'Chile',
        occupation: 'Empresario',
        income: 5000000,
        budget: 6000000,
        notes: 'Busca penthouse con vista',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Demo data created successfully',
      data: {
        users: 2,
        projects: 2,
        units: 35,
        clients: 2,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed database',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}