import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { projectSchema } from '@/lib/validators';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();
    
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        units: {
          orderBy: { unitNumber: 'asc' },
        },
        quotes: {
          include: {
            client: true,
            unit: true,
          },
        },
        _count: {
          select: {
            units: true,
            quotes: true,
          },
        },
      },
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

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Project GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch project',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();
    const body = await request.json();
    
    const validatedData = projectSchema.partial().parse(body);
    
    const project = await prisma.project.update({
      where: { id: params.id },
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
    console.error('Project PUT error:', error);
    
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
        error: 'Failed to update project',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();
    
    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Project DELETE error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete project',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}