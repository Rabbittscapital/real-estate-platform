import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      roles: Array<{
        id: string
        name: string
        description: string | null
        permissions: Array<{
          id: string
          name: string
          description: string | null
          resource: string
          action: string
        }>
      }>
      permissions: string[]
    } & DefaultSession['user']
  }

  interface User {
    id: string
    roles?: Array<{
      id: string
      name: string
      description: string | null
      permissions: Array<{
        id: string
        name: string
        description: string | null
        resource: string
        action: string
      }>
    }>
    permissions?: string[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    roles: Array<{
      id: string
      name: string
      description: string | null
      permissions: Array<{
        id: string
        name: string
        description: string | null
        resource: string
        action: string
      }>
    }>
    permissions: string[]
  }
}