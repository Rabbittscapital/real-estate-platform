'use client'

import React from 'react'
import { usePermissions } from '@/hooks/usePermissions'
import { type Permission } from '@/lib/permissions'

interface ProtectedComponentProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  loadingComponent?: React.ReactNode
}

interface WithPermissionProps extends ProtectedComponentProps {
  permission: Permission
}

interface WithPermissionsProps extends ProtectedComponentProps {
  permissions: Permission[]
  requireAll?: boolean
}

interface WithRoleProps extends ProtectedComponentProps {
  role: string
}

interface WithRolesProps extends ProtectedComponentProps {
  roles: string[]
  requireAll?: boolean
}

interface WithResourcePermissionProps extends ProtectedComponentProps {
  resource: string
  action: 'create' | 'read' | 'update' | 'delete'
}

/**
 * Component that renders children only if user has the required permission
 */
export function WithPermission({ 
  children, 
  permission, 
  fallback = null,
  loadingComponent = <div>Loading...</div>
}: WithPermissionProps) {
  const { hasPermission, isLoading } = usePermissions()
  
  if (isLoading) {
    return <>{loadingComponent}</>
  }
  
  if (!hasPermission(permission)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

/**
 * Component that renders children only if user has the required permissions
 */
export function WithPermissions({ 
  children, 
  permissions, 
  requireAll = false,
  fallback = null,
  loadingComponent = <div>Loading...</div>
}: WithPermissionsProps) {
  const { hasAnyPermission, hasAllPermissions, isLoading } = usePermissions()
  
  if (isLoading) {
    return <>{loadingComponent}</>
  }
  
  const hasRequiredPermissions = requireAll 
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions)
  
  if (!hasRequiredPermissions) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

/**
 * Component that renders children only if user has the required role
 */
export function WithRole({ 
  children, 
  role, 
  fallback = null,
  loadingComponent = <div>Loading...</div>
}: WithRoleProps) {
  const { hasRole, isLoading } = usePermissions()
  
  if (isLoading) {
    return <>{loadingComponent}</>
  }
  
  if (!hasRole(role)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

/**
 * Component that renders children only if user has any of the required roles
 */
export function WithRoles({ 
  children, 
  roles, 
  requireAll = false,
  fallback = null,
  loadingComponent = <div>Loading...</div>
}: WithRolesProps) {
  const { hasAnyRole, getUserRoles, isLoading } = usePermissions()
  
  if (isLoading) {
    return <>{loadingComponent}</>
  }
  
  const userRoles = getUserRoles()
  const hasRequiredRoles = requireAll 
    ? roles.every(role => userRoles.includes(role))
    : hasAnyRole(roles)
  
  if (!hasRequiredRoles) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

/**
 * Component that renders children only if user has resource permission
 */
export function WithResourcePermission({ 
  children, 
  resource,
  action,
  fallback = null,
  loadingComponent = <div>Loading...</div>
}: WithResourcePermissionProps) {
  const { hasResourcePermission, isLoading } = usePermissions()
  
  if (isLoading) {
    return <>{loadingComponent}</>
  }
  
  if (!hasResourcePermission(resource, action)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

/**
 * Component that renders children only if user is authenticated
 */
export function WithAuth({ 
  children, 
  fallback = <div>Please sign in to access this content.</div>,
  loadingComponent = <div>Loading...</div>
}: ProtectedComponentProps) {
  const { isAuthenticated, isLoading } = usePermissions()
  
  if (isLoading) {
    return <>{loadingComponent}</>
  }
  
  if (!isAuthenticated) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

/**
 * Component that renders children only for admin users
 */
export function WithAdminRole({ 
  children, 
  fallback = <div>Admin access required.</div>,
  loadingComponent = <div>Loading...</div>
}: ProtectedComponentProps) {
  const { isAdmin, isLoading } = usePermissions()
  
  if (isLoading) {
    return <>{loadingComponent}</>
  }
  
  if (!isAdmin()) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

/**
 * Component that renders children only for agent users
 */
export function WithAgentRole({ 
  children, 
  fallback = <div>Agent access required.</div>,
  loadingComponent = <div>Loading...</div>
}: ProtectedComponentProps) {
  const { isAgent, isLoading } = usePermissions()
  
  if (isLoading) {
    return <>{loadingComponent}</>
  }
  
  if (!isAgent()) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}