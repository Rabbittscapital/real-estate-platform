'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AuthGuard } from '@/app/components/AuthGuard';
import { AppLayout } from '@/app/components/AppLayout';
import { Card, CardContent, CardHeader } from '@/app/components/Card';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

interface Unit {
  id: string;
  unitNumber: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: number;
  floor?: number;
  orientation?: string;
  balcony: boolean;
  parking: boolean;
  storage: boolean;
  status: string;
  features: string[];
}

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
  units: Unit[];
  _count: {
    units: number;
    quotes: number;
  };
}

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        const data = await response.json();
        if (data.success) {
          setProject(data.data);
        } else {
          setError(data.error || 'Failed to fetch project');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Error al cargar el proyecto');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-800';
      case 'SOLD':
        return 'bg-red-100 text-red-800';
      case 'UNAVAILABLE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Disponible';
      case 'RESERVED':
        return 'Reservada';
      case 'SOLD':
        return 'Vendida';
      case 'UNAVAILABLE':
        return 'No disponible';
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

  if (loading) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 h-40 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  if (error || !project) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {error || 'Proyecto no encontrado'}
            </h2>
            <Link 
              href="/proyectos"
              className="text-primary-600 hover:text-primary-700"
            >
              Volver a proyectos
            </Link>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppLayout>
        <div className="space-y-6">
          {/* Breadcrumb */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/proyectos" className="text-gray-500 hover:text-gray-700">
                  Proyectos
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-900 font-medium">{project.name}</li>
            </ol>
          </nav>

          {/* Project Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative h-64 bg-gray-100">
              {project.images[0] ? (
                <img
                  src={project.images[0]}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl text-gray-400">🏢</span>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {project.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-1">
                    📍 {project.location}
                  </p>
                  {project.developer && (
                    <p className="text-gray-600">
                      🏗️ {project.developer}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Desde</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCurrency(project.startingPrice)}
                  </p>
                  {project.endingPrice && (
                    <p className="text-sm text-gray-500">
                      hasta {formatCurrency(project.endingPrice)}
                    </p>
                  )}
                </div>
              </div>

              {project.description && (
                <p className="text-gray-700 mb-4">{project.description}</p>
              )}

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{project.totalUnits}</p>
                  <p className="text-sm text-gray-600">Total Unidades</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{project.availableUnits}</p>
                  <p className="text-sm text-gray-600">Disponibles</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{project.totalUnits - project.availableUnits}</p>
                  <p className="text-sm text-gray-600">Vendidas/Reservadas</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{project._count.quotes}</p>
                  <p className="text-sm text-gray-600">Cotizaciones</p>
                </div>
              </div>

              {/* Amenities */}
              {project.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.deliveryDate && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>Fecha de entrega:</strong> {formatDate(project.deliveryDate)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Units Grid */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Unidades ({project.units.length})
            </h2>
            
            {project.units.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-4xl mb-4">🏠</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay unidades registradas
                  </h3>
                  <p className="text-gray-600">
                    Las unidades aparecerán aquí una vez que sean agregadas al proyecto
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.units.map((unit) => (
                  <Card key={unit.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Unidad {unit.unitNumber}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(unit.status)}`}>
                          {getStatusText(unit.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {getUnitTypeText(unit.type)}
                      </p>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Habitaciones:</span>
                          <span className="font-medium">{unit.bedrooms}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Baños:</span>
                          <span className="font-medium">{unit.bathrooms}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Área:</span>
                          <span className="font-medium">{unit.area} m²</span>
                        </div>
                        {unit.floor && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Piso:</span>
                            <span className="font-medium">{unit.floor}</span>
                          </div>
                        )}
                        {unit.orientation && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Orientación:</span>
                            <span className="font-medium">{unit.orientation}</span>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {unit.balcony && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            Balcón
                          </span>
                        )}
                        {unit.parking && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            Parking
                          </span>
                        )}
                        {unit.storage && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                            Bodega
                          </span>
                        )}
                      </div>

                      <div className="border-t pt-4">
                        <p className="text-lg font-bold text-primary-600 mb-3">
                          {formatCurrency(unit.price)}
                        </p>
                        <button 
                          className="w-full bg-primary-600 text-white py-2 px-3 rounded-md text-sm hover:bg-primary-700 transition-colors disabled:opacity-50"
                          disabled={unit.status !== 'AVAILABLE'}
                        >
                          {unit.status === 'AVAILABLE' ? 'Crear Cotización' : 'No Disponible'}
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}