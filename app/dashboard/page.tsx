'use client';

import { useEffect, useState } from 'react';
import { AuthGuard } from '@/app/components/AuthGuard';
import { AppLayout } from '@/app/components/AppLayout';
import { Card, CardContent, CardHeader } from '@/app/components/Card';
import { formatCurrency } from '@/lib/utils';

interface DashboardStats {
  totalProjects: number;
  totalUnits: number;
  availableUnits: number;
  totalClients: number;
  activeQuotes: number;
  totalRevenue: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - in real app, fetch from API
    const fetchStats = async () => {
      try {
        // Mock data for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats({
          totalProjects: 2,
          totalUnits: 35,
          availableUnits: 30,
          totalClients: 2,
          activeQuotes: 0,
          totalRevenue: 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Resumen general de la plataforma inmobiliaria
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Proyectos Activos
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-primary-600">
                    {stats?.totalProjects || 0}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">proyectos</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Total Unidades
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-primary-600">
                    {stats?.totalUnits || 0}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">unidades</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Unidades Disponibles
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-success-600">
                    {stats?.availableUnits || 0}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">disponibles</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Clientes Registrados
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-primary-600">
                    {stats?.totalClients || 0}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">clientes</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cotizaciones Activas
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-warning-600">
                    {stats?.activeQuotes || 0}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">cotizaciones</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  Ingresos Totales
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-success-600">
                    {formatCurrency(stats?.totalRevenue || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                Acciones Rápidas
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <a
                  href="/proyectos"
                  className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <span className="text-2xl mr-3">🏢</span>
                  <div>
                    <p className="font-medium text-primary-900">Ver Proyectos</p>
                    <p className="text-sm text-primary-600">Gestionar proyectos</p>
                  </div>
                </a>

                <a
                  href="/clientes"
                  className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <span className="text-2xl mr-3">👥</span>
                  <div>
                    <p className="font-medium text-green-900">Ver Clientes</p>
                    <p className="text-sm text-green-600">Gestionar clientes</p>
                  </div>
                </a>

                <a
                  href="/cotizaciones"
                  className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  <span className="text-2xl mr-3">💰</span>
                  <div>
                    <p className="font-medium text-yellow-900">Cotizaciones</p>
                    <p className="text-sm text-yellow-600">Crear cotización</p>
                  </div>
                </a>

                <a
                  href="/reservas"
                  className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <span className="text-2xl mr-3">📝</span>
                  <div>
                    <p className="font-medium text-purple-900">Reservas</p>
                    <p className="text-sm text-purple-600">Ver reservas</p>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}