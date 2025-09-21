import { Session } from 'next-auth'

export type Permission = string
export type Resource = string
export type Action = 'create' | 'read' | 'update' | 'delete'

/**
 * Check if user has a specific permission
 */
export function hasPermission(session: Session | null, permission: Permission): boolean {
  if (!session?.user?.permissions) {
    return false
  }
  
  return session.user.permissions.includes(permission)
}

/**
 * Check if user has permission for a resource and action
 */
export function hasResourcePermission(
  session: Session | null, 
  resource: Resource, 
  action: Action
): boolean {
  const permission = `${resource}:${action}`
  return hasPermission(session, permission)
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(session: Session | null, permissions: Permission[]): boolean {
  if (!session?.user?.permissions) {
    return false
  }
  
  return permissions.some(permission => session.user.permissions.includes(permission))
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(session: Session | null, permissions: Permission[]): boolean {
  if (!session?.user?.permissions) {
    return false
  }
  
  return permissions.every(permission => session.user.permissions.includes(permission))
}

/**
 * Check if user has a specific role
 */
export function hasRole(session: Session | null, roleName: string): boolean {
  if (!session?.user?.roles) {
    return false
  }
  
  return session.user.roles.some(role => role.name === roleName)
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(session: Session | null, roleNames: string[]): boolean {
  if (!session?.user?.roles) {
    return false
  }
  
  return roleNames.some(roleName => 
    session.user.roles.some(role => role.name === roleName)
  )
}

/**
 * Get user's role names
 */
export function getUserRoles(session: Session | null): string[] {
  if (!session?.user?.roles) {
    return []
  }
  
  return session.user.roles.map(role => role.name)
}

/**
 * Get user's permissions
 */
export function getUserPermissions(session: Session | null): string[] {
  if (!session?.user?.permissions) {
    return []
  }
  
  return session.user.permissions
}

/**
 * Check if user is administrator
 */
export function isAdmin(session: Session | null): boolean {
  return hasRole(session, 'administrator')
}

/**
 * Check if user is agent
 */
export function isAgent(session: Session | null): boolean {
  return hasRole(session, 'agent')
}

/**
 * Check if user is basic user
 */
export function isUser(session: Session | null): boolean {
  return hasRole(session, 'user')
}

// Permission constants for easy import and type safety
export const PERMISSIONS = {
  // User management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // Project management
  PROJECT_CREATE: 'project:create',
  PROJECT_READ: 'project:read',
  PROJECT_UPDATE: 'project:update',
  PROJECT_DELETE: 'project:delete',
  
  // Property management
  PROPERTY_CREATE: 'property:create',
  PROPERTY_READ: 'property:read',
  PROPERTY_UPDATE: 'property:update',
  PROPERTY_DELETE: 'property:delete',
  
  // Reports
  REPORT_SALES: 'report:sales',
  REPORT_ANALYTICS: 'report:analytics',
  REPORT_ADMIN: 'report:admin',
  
  // Role management
  ROLE_CREATE: 'role:create',
  ROLE_READ: 'role:read',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',
  
  // Profile
  PROFILE_READ: 'profile:read',
  PROFILE_UPDATE: 'profile:update',
} as const

// Role constants
export const ROLES = {
  ADMINISTRATOR: 'administrator',
  AGENT: 'agent',
  USER: 'user',
} as const