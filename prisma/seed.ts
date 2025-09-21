import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create basic permissions
  const permissions = [
    // User management
    { name: 'user:create', description: 'Create users', resource: 'user', action: 'create' },
    { name: 'user:read', description: 'View users', resource: 'user', action: 'read' },
    { name: 'user:update', description: 'Update users', resource: 'user', action: 'update' },
    { name: 'user:delete', description: 'Delete users', resource: 'user', action: 'delete' },
    
    // Project management
    { name: 'project:create', description: 'Create projects', resource: 'project', action: 'create' },
    { name: 'project:read', description: 'View projects', resource: 'project', action: 'read' },
    { name: 'project:update', description: 'Update projects', resource: 'project', action: 'update' },
    { name: 'project:delete', description: 'Delete projects', resource: 'project', action: 'delete' },
    
    // Property management
    { name: 'property:create', description: 'Create properties', resource: 'property', action: 'create' },
    { name: 'property:read', description: 'View properties', resource: 'property', action: 'read' },
    { name: 'property:update', description: 'Update properties', resource: 'property', action: 'update' },
    { name: 'property:delete', description: 'Delete properties', resource: 'property', action: 'delete' },
    
    // Report access
    { name: 'report:sales', description: 'Access sales reports', resource: 'report', action: 'read' },
    { name: 'report:analytics', description: 'Access analytics reports', resource: 'report', action: 'read' },
    { name: 'report:admin', description: 'Access admin reports', resource: 'report', action: 'read' },
    
    // Role and permission management
    { name: 'role:create', description: 'Create roles', resource: 'role', action: 'create' },
    { name: 'role:read', description: 'View roles', resource: 'role', action: 'read' },
    { name: 'role:update', description: 'Update roles', resource: 'role', action: 'update' },
    { name: 'role:delete', description: 'Delete roles', resource: 'role', action: 'delete' },
    
    // Profile management
    { name: 'profile:read', description: 'View own profile', resource: 'profile', action: 'read' },
    { name: 'profile:update', description: 'Update own profile', resource: 'profile', action: 'update' },
  ]

  console.log('Creating permissions...')
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    })
  }

  // Create roles
  const administratorRole = await prisma.role.upsert({
    where: { name: 'administrator' },
    update: {},
    create: {
      name: 'administrator',
      description: 'Full system access - can manage users, roles, and all resources',
    },
  })

  const agentRole = await prisma.role.upsert({
    where: { name: 'agent' },
    update: {},
    create: {
      name: 'agent',
      description: 'Real estate agent - can manage properties and access sales reports',
    },
  })

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Basic user - can view properties and manage own profile',
    },
  })

  // Assign permissions to roles
  console.log('Assigning permissions to roles...')

  // Administrator gets all permissions
  const allPermissions = await prisma.permission.findMany()
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: administratorRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: administratorRole.id,
        permissionId: permission.id,
      },
    })
  }

  // Agent permissions
  const agentPermissionNames = [
    'project:create', 'project:read', 'project:update', 'project:delete',
    'property:create', 'property:read', 'property:update', 'property:delete',
    'report:sales', 'report:analytics',
    'profile:read', 'profile:update',
    'user:read' // Can view user profiles for client management
  ]

  for (const permissionName of agentPermissionNames) {
    const permission = await prisma.permission.findUnique({ where: { name: permissionName } })
    if (permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: agentRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: agentRole.id,
          permissionId: permission.id,
        },
      })
    }
  }

  // User permissions
  const userPermissionNames = [
    'property:read',
    'profile:read', 'profile:update'
  ]

  for (const permissionName of userPermissionNames) {
    const permission = await prisma.permission.findUnique({ where: { name: permissionName } })
    if (permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: userRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: userRole.id,
          permissionId: permission.id,
        },
      })
    }
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })