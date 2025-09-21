'use client';

import { useEffect, useState } from 'react';
import { AuthGuard } from '@/app/components/AuthGuard';
import { AppLayout } from '@/app/components/AppLayout';
import { Card, CardContent } from '@/app/components/Card';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Reservation {
  id: string;
  reservationFee: number;
  reservedAt: string;
  expiresAt: string;
  status: string;
  notes?: string;
  createdAt: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  unit: {
    id: string;
    unitNumber: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    price: number;
    project: {
      id: string;
      name: string;
      location: string;
    };
  };
  quote?: {
    id: string;
    quoteNumber: string;
    finalPrice: number;
  };
}

export default function ReservasPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data for demo since we don't have reservations in seed
    const fetchReservations = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setReservations([]); // Empty for now
      } catch (error) {
        console.error('Error fetching reservations:', error);
        setError('Error al cargar las reservas');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      case 'CONVERTED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Activa';
      case 'EXPIRED':
        return 'Vencida';
      case 'CANCELLED':
        return 'Cancelada';
      case 'CONVERTED':
        return 'Convertida';
      default:
        return status;
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

  const isExpiringSoon = (expiresAt: string) => {
    const expirationDate = new Date(expiresAt);
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    return expirationDate <= threeDaysFromNow;
  };

  if (loading) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-40 rounded-lg"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
              <p className="text-gray-600">
                Gestiona todas las reservas de unidades
              </p>
            </div>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
              + Nueva Reserva
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {reservations.length === 0 && !loading && !error && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay reservas registradas
                </h3>
                <p className="text-gray-600 mb-4">
                  Las reservas aparecerán aquí cuando los clientes reserven unidades
                </p>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                  Crear Reserva
                </button>
              </CardContent>
            </Card>
          )}

          {/* Reservations List */}
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <Card key={reservation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Reserva #{reservation.id.slice(-8)}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                          {getStatusText(reservation.status)}
                        </span>
                        {reservation.status === 'ACTIVE' && isExpiringSoon(reservation.expiresAt) && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            ⚠️ Próxima a vencer
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Reservada el {formatDate(reservation.reservedAt)} • Vence el {formatDate(reservation.expiresAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">
                        {formatCurrency(reservation.reservationFee)}
                      </p>
                      <p className="text-sm text-gray-500">Abono de reserva</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    {/* Client Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Cliente</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900">
                          {reservation.client.firstName} {reservation.client.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{reservation.client.email}</p>
                        {reservation.client.phone && (
                          <p className="text-sm text-gray-600">📞 {reservation.client.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Property Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Propiedad</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900">{reservation.unit.project.name}</p>
                        <p className="text-sm text-gray-600">
                          Unidad {reservation.unit.unitNumber} - {getUnitTypeText(reservation.unit.type)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {reservation.unit.bedrooms} hab, {reservation.unit.bathrooms} baños, {reservation.unit.area} m²
                        </p>
                        <p className="text-sm text-gray-600">📍 {reservation.unit.project.location}</p>
                        <p className="text-sm font-medium text-gray-900">
                          Precio: {formatCurrency(reservation.unit.price)}
                        </p>
                      </div>
                    </div>

                    {/* Quote Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Cotización</h4>
                      {reservation.quote ? (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-900">
                            #{reservation.quote.quoteNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            Precio final: {formatCurrency(reservation.quote.finalPrice)}
                          </p>
                          <button className="text-sm text-primary-600 hover:text-primary-700">
                            Ver cotización →
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Sin cotización asociada</p>
                          <button className="text-sm text-primary-600 hover:text-primary-700">
                            Crear cotización →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {reservation.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Notas</h4>
                      <p className="text-sm text-gray-700">{reservation.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-md text-sm hover:bg-gray-200 transition-colors">
                      Ver Detalles
                    </button>
                    
                    {reservation.status === 'ACTIVE' && (
                      <>
                        <button className="bg-blue-600 text-white py-2 px-3 rounded-md text-sm hover:bg-blue-700 transition-colors">
                          Generar Contrato
                        </button>
                        <button className="bg-green-600 text-white py-2 px-3 rounded-md text-sm hover:bg-green-700 transition-colors">
                          Convertir a Venta
                        </button>
                        <button className="bg-red-600 text-white py-2 px-3 rounded-md text-sm hover:bg-red-700 transition-colors">
                          Cancelar Reserva
                        </button>
                      </>
                    )}
                    
                    {reservation.status === 'EXPIRED' && (
                      <button className="bg-yellow-600 text-white py-2 px-3 rounded-md text-sm hover:bg-yellow-700 transition-colors">
                        Renovar Reserva
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">Reservas Activas</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">0</div>
                <div className="text-sm text-gray-600">Por Vencer</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Convertidas</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {formatCurrency(0)}
                </div>
                <div className="text-sm text-gray-600">Total Reservas</div>
              </CardContent>
            </Card>
          </div>

          {/* Info notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-1">
              💡 Gestión de Reservas
            </h3>
            <p className="text-sm text-blue-700">
              Las reservas se crean automáticamente cuando un cliente acepta una cotización y realiza el pago de reserva. 
              Desde aquí puedes gestionar el proceso completo hasta la conversión en venta.
            </p>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}