'use client';

import { useEffect, useState } from 'react';
import { AuthGuard } from '@/app/components/AuthGuard';
import { AppLayout } from '@/app/components/AppLayout';
import { Card, CardContent } from '@/app/components/Card';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Quote {
  id: string;
  quoteNumber: string;
  basePrice: number;
  discountAmount: number;
  discountPercent: number;
  finalPrice: number;
  paymentPlan: string;
  downPayment: number;
  monthlyPayment?: number;
  validUntil: string;
  status: string;
  notes?: string;
  createdAt: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  project: {
    id: string;
    name: string;
    location: string;
  };
  unit: {
    id: string;
    unitNumber: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
  };
}

export default function CotizacionesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch('/api/quotes');
        if (!response.ok) {
          throw new Error('Failed to fetch quotes');
        }
        const data = await response.json();
        if (data.success) {
          setQuotes(data.data.quotes);
        } else {
          setError(data.error || 'Failed to fetch quotes');
        }
      } catch (error) {
        console.error('Error fetching quotes:', error);
        setError('Error al cargar las cotizaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'SENT':
        return 'bg-blue-100 text-blue-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'EXPIRED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'Borrador';
      case 'SENT':
        return 'Enviada';
      case 'ACCEPTED':
        return 'Aceptada';
      case 'REJECTED':
        return 'Rechazada';
      case 'EXPIRED':
        return 'Vencida';
      default:
        return status;
    }
  };

  const getPaymentPlanText = (plan: string) => {
    switch (plan) {
      case 'CASH':
        return 'Contado';
      case 'FINANCED':
        return 'Financiado';
      case 'CUSTOM':
        return 'Personalizado';
      default:
        return plan;
    }
  };

  const getUnitTypeText = (type: string) => {
    switch (type) {
      case 'APARTMENT':
        return 'Departamento';
      case 'PENTHOUSE':
        return 'Penthouse';
      case 'STUDIO':
        return 'Studio';
      case 'LOFT':
        return 'Loft';
      case 'COMMERCIAL':
        return 'Comercial';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
              ))}
            </div>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cotizaciones</h1>
              <p className="text-gray-600">
                Gestiona todas las cotizaciones de propiedades
              </p>
            </div>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
              + Nueva Cotización
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {quotes.length === 0 && !loading && !error && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay cotizaciones registradas
                </h3>
                <p className="text-gray-600 mb-4">
                  Comienza creando tu primera cotización
                </p>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                  Crear Cotización
                </button>
              </CardContent>
            </Card>
          )}

          {/* Quotes List */}
          <div className="space-y-4">
            {quotes.map((quote) => (
              <Card key={quote.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Cotización #{quote.quoteNumber}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                          {getStatusText(quote.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Creada el {formatDate(quote.createdAt)} • Válida hasta {formatDate(quote.validUntil)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">
                        {formatCurrency(quote.finalPrice)}
                      </p>
                      {quote.discountAmount > 0 && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatCurrency(quote.basePrice)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    {/* Client Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Cliente</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900">
                          {quote.client.firstName} {quote.client.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{quote.client.email}</p>
                      </div>
                    </div>

                    {/* Property Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Propiedad</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900">{quote.project.name}</p>
                        <p className="text-sm text-gray-600">
                          Unidad {quote.unit.unitNumber} - {getUnitTypeText(quote.unit.type)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {quote.unit.bedrooms} hab, {quote.unit.bathrooms} baños, {quote.unit.area} m²
                        </p>
                        <p className="text-sm text-gray-600">📍 {quote.project.location}</p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Pago</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900">
                          Plan: {getPaymentPlanText(quote.paymentPlan)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Pie: {formatCurrency(quote.downPayment)}
                        </p>
                        {quote.monthlyPayment && (
                          <p className="text-sm text-gray-600">
                            Cuota mensual: {formatCurrency(quote.monthlyPayment)}
                          </p>
                        )}
                        {quote.discountPercent > 0 && (
                          <p className="text-sm text-green-600">
                            Descuento: {quote.discountPercent}%
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {quote.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{quote.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-md text-sm hover:bg-gray-200 transition-colors">
                      Ver Detalles
                    </button>
                    <button className="bg-blue-600 text-white py-2 px-3 rounded-md text-sm hover:bg-blue-700 transition-colors">
                      Descargar PDF
                    </button>
                    {quote.status === 'DRAFT' && (
                      <button className="bg-green-600 text-white py-2 px-3 rounded-md text-sm hover:bg-green-700 transition-colors">
                        Enviar
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Demo notice */}
          {quotes.length === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-1">
                💡 Crear Cotización
              </h3>
              <p className="text-sm text-blue-700">
                Para crear cotizaciones, primero asegúrate de tener clientes y proyectos con unidades disponibles. 
                Luego puedes generar cotizaciones desde la vista de detalle de un proyecto.
              </p>
            </div>
          )}
        </div>
      </AppLayout>
    </AuthGuard>
  );
}