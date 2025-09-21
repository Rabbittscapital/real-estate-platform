import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { bulkUnitsSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    
    const { projectId, units } = bulkUnitsSchema.parse(body);
    
    // Validate that the project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    
    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project not found',
        },
        { status: 404 }
      );
    }
    
    // Prepare units data with projectId
    const unitsData = units.map(unit => ({
      ...unit,
      projectId,
    }));
    
    // Create units in bulk
    const createdUnits = await prisma.unit.createMany({
      data: unitsData,
      skipDuplicates: true,
    });
    
    // Update project's available units count
    await prisma.project.update({
      where: { id: projectId },
      data: {
        availableUnits: {
          increment: createdUnits.count,
        },
        totalUnits: {
          increment: createdUnits.count,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        created: createdUnits.count,
        projectId,
      },
      message: `Successfully created ${createdUnits.count} units`,
    });
  } catch (error) {
    console.error('Bulk units POST error:', error);
    
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
        error: 'Failed to create units',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}