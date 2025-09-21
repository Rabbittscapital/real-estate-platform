import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { unitSchema, unitSearchSchema } from '@/lib/validators';

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
      minBedrooms: query.minBedrooms ? parseInt(query.minBedrooms) : undefined,
      maxBedrooms: query.maxBedrooms ? parseInt(query.maxBedrooms) : undefined,
      minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
      minArea: query.minArea ? parseFloat(query.minArea) : undefined,
      maxArea: query.maxArea ? parseFloat(query.maxArea) : undefined,
    };
    
    const { 
      projectId,
      type,
      status,
      minBedrooms,
      maxBedrooms,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      page,
      limit 
    } = unitSearchSchema.parse(parsedQuery);

    const where: any = {};
    
    if (projectId) {
      where.projectId = projectId;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (minBedrooms !== undefined || maxBedrooms !== undefined) {
      where.bedrooms = {};
      if (minBedrooms !== undefined) where.bedrooms.gte = minBedrooms;
      if (maxBedrooms !== undefined) where.bedrooms.lte = maxBedrooms;
    }
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }
    
    if (minArea || maxArea) {
      where.area = {};
      if (minArea) where.area.gte = minArea;
      if (maxArea) where.area.lte = maxArea;
    }

    const [units, total] = await Promise.all([
      prisma.unit.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { unitNumber: 'asc' },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              location: true,
            },
          },
          quotes: {
            select: {
              id: true,
              status: true,
              finalPrice: true,
            },
          },
        },
      }),
      prisma.unit.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        units,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Units GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch units',
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
    
    const validatedData = unitSchema.parse(body);
    
    const unit = await prisma.unit.create({
      data: validatedData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: unit,
    });
  } catch (error) {
    console.error('Units POST error:', error);
    
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
        error: 'Failed to create unit',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}