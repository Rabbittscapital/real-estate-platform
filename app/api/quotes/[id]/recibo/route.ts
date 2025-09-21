import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { formatCurrency, formatDate } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    
    const quote = await prisma.quote.findUnique({
      where: { 
        id: params.id,
        userId: session.user.id,
      },
      include: {
        client: true,
        project: true,
        unit: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!quote) {
      return NextResponse.json(
        {
          success: false,
          error: 'Quote not found',
        },
        { status: 404 }
      );
    }

    // Generate receipt/quote document content
    const receiptContent = {
      quoteNumber: quote.quoteNumber,
      date: formatDate(quote.createdAt),
      validUntil: formatDate(quote.validUntil),
      agent: {
        name: quote.user.name,
        email: quote.user.email,
      },
      client: {
        name: `${quote.client.firstName} ${quote.client.lastName}`,
        email: quote.client.email,
        phone: quote.client.phone,
      },
      project: {
        name: quote.project.name,
        location: quote.project.location,
        developer: quote.project.developer,
      },
      unit: {
        number: quote.unit.unitNumber,
        type: quote.unit.type,
        bedrooms: quote.unit.bedrooms,
        bathrooms: quote.unit.bathrooms,
        area: `${quote.unit.area} m²`,
        floor: quote.unit.floor,
        features: quote.unit.features,
      },
      pricing: {
        basePrice: formatCurrency(Number(quote.basePrice)),
        discountAmount: formatCurrency(Number(quote.discountAmount)),
        discountPercent: `${quote.discountPercent}%`,
        finalPrice: formatCurrency(Number(quote.finalPrice)),
        downPayment: formatCurrency(Number(quote.downPayment)),
        monthlyPayment: quote.monthlyPayment ? formatCurrency(Number(quote.monthlyPayment)) : null,
        paymentPlan: quote.paymentPlan,
      },
      notes: quote.notes,
      status: quote.status,
    };

    return NextResponse.json({
      success: true,
      data: receiptContent,
    });
  } catch (error) {
    console.error('Quote receipt GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate quote receipt',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}