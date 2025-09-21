import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { clientSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: Record<string, unknown> = {
      userId: session.user.id,
    };
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          quotes: {
            select: {
              id: true,
              status: true,
              finalPrice: true,
            },
          },
          reservations: {
            select: {
              id: true,
              status: true,
            },
          },
          _count: {
            select: {
              quotes: true,
              reservations: true,
            },
          },
        },
      }),
      prisma.client.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        clients,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Clients GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch clients',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    
    const validatedData = clientSchema.parse(body);
    
    const client = await prisma.client.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
      include: {
        quotes: true,
        reservations: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error('Clients POST error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: error.message,
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create client',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}