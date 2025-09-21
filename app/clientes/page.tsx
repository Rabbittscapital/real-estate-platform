'use client';

import { useEffect, useState } from 'react';
import { AuthGuard } from '@/app/components/AuthGuard';
import { AppLayout } from '@/app/components/AppLayout';
import { Card, CardContent, CardHeader } from '@/app/components/Card';
import { formatCurrency } from '@/lib/utils';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  occupation?: string;
  income?: number;
  budget?: number;
  notes?: string;
  createdAt: string;
  _count: {
    quotes: number;
    reservations: number;
  };
}

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }
        const data = await response.json();
        if (data.success) {
          setClients(data.data.clients);
        } else {
          setError(data.error || 'Failed to fetch clients');
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
        setError('Error al cargar los clientes');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-48 rounded-lg"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
              <p className="text-gray-600">
                Gestiona tu cartera de clientes
              </p>
            </div>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
              + Nuevo Cliente
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {clients.length === 0 && !loading && !error && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay clientes registrados
                </h3>
                <p className="text-gray-600 mb-4">
                  Comienza agregando tu primer cliente
                </p>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                  Agregar Cliente
                </button>
              </CardContent>
            </Card>
          )}

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary-600">
                        {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {client.firstName} {client.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{client.email}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {client.phone && (
                      <div className="flex items-center text-sm">
                        <span className="text-gray-600 w-16">📞</span>
                        <span className="text-gray-900">{client.phone}</span>
                      </div>
                    )}

                    {client.city && (
                      <div className="flex items-center text-sm">
                        <span className="text-gray-600 w-16">📍</span>
                        <span className="text-gray-900">{client.city}{client.country && `, ${client.country}`}</span>
                      </div>
                    )}

                    {client.occupation && (
                      <div className="flex items-center text-sm">
                        <span className="text-gray-600 w-16">💼</span>
                        <span className="text-gray-900">{client.occupation}</span>
                      </div>
                    )}

                    {client.budget && (
                      <div className="flex items-center text-sm">
                        <span className="text-gray-600 w-16">💰</span>
                        <span className="text-gray-900">{formatCurrency(client.budget)}</span>
                      </div>
                    )}

                    {client.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
                        {client.notes}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cotizaciones:</span>
                      <span className="font-medium">{client._count.quotes}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Reservas:</span>
                      <span className="font-medium">{client._count.reservations}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-primary-600 text-white py-2 px-3 rounded-md text-sm hover:bg-primary-700 transition-colors">
                      Ver Detalles
                    </button>
                    <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-md text-sm hover:bg-gray-200 transition-colors">
                      ⚙️
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Demo notice */}
          {clients.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-1">
                💡 Demo Data
              </h3>
              <p className="text-sm text-blue-700">
                Los clientes mostrados son datos de demostración creados por el seeder.
              </p>
            </div>
          )}
        </div>
      </AppLayout>
    </AuthGuard>
  );
}