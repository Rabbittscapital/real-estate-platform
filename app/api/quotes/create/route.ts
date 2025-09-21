import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { quoteSchema } from '@/lib/validators';
import { generateQuoteNumber } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    
    const validatedData = quoteSchema.parse(body);
    
    // Calculate final price based on discount
    let finalPrice = validatedData.basePrice;
    
    if (validatedData.discountAmount > 0) {
      finalPrice = validatedData.basePrice - validatedData.discountAmount;
    } else if (validatedData.discountPercent > 0) {
      finalPrice = validatedData.basePrice * (1 - validatedData.discountPercent / 100);
    }
    
    // Verify that client, project, and unit exist and belong to the user
    const [client, unit] = await Promise.all([
      prisma.client.findUnique({
        where: { 
          id: validatedData.clientId,
          userId: session.user.id,
        },
      }),
      prisma.unit.findUnique({
        where: { id: validatedData.unitId },
        include: { project: true },
      }),
    ]);
    
    if (!client) {
      return NextResponse.json(
        {
          success: false,
          error: 'Client not found or unauthorized',
        },
        { status: 404 }
      );
    }
    
    if (!unit || unit.projectId !== validatedData.projectId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unit not found or does not belong to the specified project',
        },
        { status: 404 }
      );
    }
    
    const quote = await prisma.quote.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        quoteNumber: generateQuoteNumber(),
        finalPrice,
        status: 'DRAFT' as const,
      },
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
    });

    return NextResponse.json({
      success: true,
      data: quote,
    });
  } catch (error) {
    console.error('Quote CREATE error:', error);
    
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
        error: 'Failed to create quote',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}