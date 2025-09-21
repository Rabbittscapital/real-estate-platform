import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import {
  hasPermission,
  hasResourcePermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  getUserRoles,
  getUserPermissions,
  isAdmin,
  isAgent,
  isUser,
  type Permission,
  type Resource,
  type Action,
} from '@/lib/permissions'

/**
 * Hook for checking user permissions and roles
 */
export function usePermissions() {
  const { data: session, status } = useSession()
  
  const permissions = useMemo(() => {
    return {
      // Permission checks
      hasPermission: (permission: Permission) => hasPermission(session, permission),
      hasResourcePermission: (resource: Resource, action: Action) => 
        hasResourcePermission(session, resource, action),
      hasAnyPermission: (permissions: Permission[]) => hasAnyPermission(session, permissions),
      hasAllPermissions: (permissions: Permission[]) => hasAllPermissions(session, permissions),
      
      // Role checks
      hasRole: (roleName: string) => hasRole(session, roleName),
      hasAnyRole: (roleNames: string[]) => hasAnyRole(session, roleNames),
      
      // Convenience role checks
      isAdmin: () => isAdmin(session),
      isAgent: () => isAgent(session),
      isUser: () => isUser(session),
      
      // Get user data
      getUserRoles: () => getUserRoles(session),
      getUserPermissions: () => getUserPermissions(session),
      
      // Session status
      isLoading: status === 'loading',
      isAuthenticated: status === 'authenticated',
      session,
    }
  }, [session, status])
  
  return permissions
}

/**
 * Hook for checking a specific permission
 */
export function useHasPermission(permission: Permission) {
  const { data: session } = useSession()
  
  return useMemo(() => {
    return hasPermission(session, permission)
  }, [session, permission])
}

/**
 * Hook for checking resource permission
 */
export function useHasResourcePermission(resource: Resource, action: Action) {
  const { data: session } = useSession()
  
  return useMemo(() => {
    return hasResourcePermission(session, resource, action)
  }, [session, resource, action])
}

/**
 * Hook for checking if user has any of the specified permissions
 */
export function useHasAnyPermission(permissions: Permission[]) {
  const { data: session } = useSession()
  
  return useMemo(() => {
    return hasAnyPermission(session, permissions)
  }, [session, permissions])
}

/**
 * Hook for checking if user has a specific role
 */
export function useHasRole(roleName: string) {
  const { data: session } = useSession()
  
  return useMemo(() => {
    return hasRole(session, roleName)
  }, [session, roleName])
}

/**
 * Hook for checking if user has any of the specified roles
 */
export function useHasAnyRole(roleNames: string[]) {
  const { data: session } = useSession()
  
  return useMemo(() => {
    return hasAnyRole(session, roleNames)
  }, [session, roleNames])
}

/**
 * Hook for admin role check
 */
export function useIsAdmin() {
  const { data: session } = useSession()
  
  return useMemo(() => {
    return isAdmin(session)
  }, [session])
}

/**
 * Hook for agent role check
 */
export function useIsAgent() {
  const { data: session } = useSession()
  
  return useMemo(() => {
    return isAgent(session)
  }, [session])
}

/**
 * Hook for basic user role check
 */
export function useIsUser() {
  const { data: session } = useSession()
  
  return useMemo(() => {
    return isUser(session)
  }, [session])
}