import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { clientSchema } from '@/lib/validators';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    
    const client = await prisma.client.findUnique({
      where: { 
        id: id,
        userId: session.user.id,
      },
      include: {
        quotes: {
          include: {
            project: true,
            unit: true,
          },
        },
        reservations: {
          include: {
            unit: {
              include: {
                project: true,
              },
            },
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        {
          success: false,
          error: 'Client not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error('Client GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch client',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    
    const validatedData = clientSchema.partial().parse(body);
    
    const client = await prisma.client.update({
      where: { 
        id: id,
        userId: session.user.id,
      },
      data: validatedData,
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
    console.error('Client PUT error:', error);
    
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
        error: 'Failed to update client',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    
    await prisma.client.delete({
      where: { 
        id: id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    console.error('Client DELETE error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete client',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}