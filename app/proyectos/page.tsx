'use client';

import { useEffect, useState } from 'react';
import { AuthGuard } from '@/app/components/AuthGuard';
import { AppLayout } from '@/app/components/AppLayout';
import { Card, CardContent, CardHeader } from '@/app/components/Card';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description?: string;
  location: string;
  developer?: string;
  totalUnits: number;
  availableUnits: number;
  startingPrice: number;
  endingPrice?: number;
  deliveryDate?: string;
  status: string;
  images: string[];
  amenities: string[];
  createdAt: string;
  _count: {
    units: number;
  };
}

export default function ProyectosPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        if (data.success) {
          setProjects(data.data.projects);
        } else {
          setError(data.error || 'Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Error al cargar los proyectos');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_CONSTRUCTION':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'SOLD_OUT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PLANNING':
        return 'Planificación';
      case 'UNDER_CONSTRUCTION':
        return 'En Construcción';
      case 'COMPLETED':
        return 'Completado';
      case 'SOLD_OUT':
        return 'Agotado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
              <p className="text-gray-600">
                Gestiona todos los proyectos inmobiliarios
              </p>
            </div>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
              + Nuevo Proyecto
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {projects.length === 0 && !loading && !error && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">🏢</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay proyectos registrados
                </h3>
                <p className="text-gray-600 mb-4">
                  Comienza creando tu primer proyecto inmobiliario
                </p>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                  Crear Proyecto
                </button>
              </CardContent>
            </Card>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <div className="aspect-w-16 aspect-h-9 relative">
                  {project.images[0] ? (
                    <img
                      src={project.images[0]}
                      alt={project.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                      <span className="text-4xl text-gray-400">🏢</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </div>
                </div>

                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    📍 {project.location}
                  </p>
                  {project.developer && (
                    <p className="text-sm text-gray-500">
                      🏗️ {project.developer}
                    </p>
                  )}
                </CardHeader>

                <CardContent>
                  {project.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total unidades:</span>
                      <span className="font-medium">{project.totalUnits}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Disponibles:</span>
                      <span className="font-medium text-green-600">{project.availableUnits}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Desde:</span>
                      <span className="font-medium">{formatCurrency(project.startingPrice)}</span>
                    </div>
                    {project.endingPrice && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hasta:</span>
                        <span className="font-medium">{formatCurrency(project.endingPrice)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Link 
                      href={`/proyectos/${project.id}`}
                      className="flex-1 bg-primary-600 text-white text-center py-2 px-3 rounded-md text-sm hover:bg-primary-700 transition-colors"
                    >
                      Ver Detalles
                    </Link>
                    <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-md text-sm hover:bg-gray-200 transition-colors">
                      ⚙️
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Demo notice */}
          {projects.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-1">
                💡 Demo Data
              </h3>
              <p className="text-sm text-blue-700">
                Los proyectos mostrados son datos de demostración. Para poblar la base de datos con más ejemplos, 
                ejecuta el endpoint <code className="bg-blue-100 px-1 rounded">/api/seed</code>.
              </p>
            </div>
          )}
        </div>
      </AppLayout>
    </AuthGuard>
  );
}