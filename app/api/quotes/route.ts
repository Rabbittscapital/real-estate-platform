import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {
      userId: session.user.id,
    };
    
    if (clientId) {
      where.clientId = clientId;
    }
    
    if (projectId) {
      where.projectId = projectId;
    }
    
    if (status) {
      where.status = status;
    }

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: true,
          project: {
            select: {
              id: true,
              name: true,
              location: true,
            },
          },
          unit: {
            select: {
              id: true,
              unitNumber: true,
              type: true,
              bedrooms: true,
              bathrooms: true,
              area: true,
            },
          },
        },
      }),
      prisma.quote.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        quotes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Quotes GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch quotes',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}