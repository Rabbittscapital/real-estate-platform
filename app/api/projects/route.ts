import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { projectSchema, projectSearchSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    
    // Convert string values to appropriate types
    const parsedQuery = {
      ...query,
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 10,
      minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
    };
    
    const { 
      search, 
      location, 
      status, 
      minPrice, 
      maxPrice, 
      page, 
      limit 
    } = projectSearchSchema.parse(parsedQuery);

    const where: Record<string, unknown> = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }
    
    if (status) {
      where.status = status;
    }
    
    if (minPrice || maxPrice) {
      where.startingPrice = {} as Record<string, unknown>;
      if (minPrice) (where.startingPrice as Record<string, unknown>).gte = minPrice;
      if (maxPrice) (where.startingPrice as Record<string, unknown>).lte = maxPrice;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          units: {
            select: {
              id: true,
              status: true,
              price: true,
            },
          },
          _count: {
            select: {
              units: true,
            },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch projects',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    
    const validatedData = projectSchema.parse(body);
    
    const project = await prisma.project.create({
      data: validatedData,
      include: {
        units: true,
        _count: {
          select: {
            units: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Projects POST error:', error);
    
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
        error: 'Failed to create project',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}