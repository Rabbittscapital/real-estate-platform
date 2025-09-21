'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { usePermissions } from '@/hooks/usePermissions'
import { WithAdminRole, WithAgentRole, WithAuth } from '@/components/auth/ProtectedComponents'

export default function Home() {
  const { data: session } = useSession()
  const { isAdmin, isAgent, getUserRoles, getUserPermissions } = usePermissions()

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Real Estate Platform
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Role-Based Access Control Demo
          </p>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          {/* Authentication Section */}
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Authentication Status
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              {session ? (
                <div>
                  <p>Welcome, {session.user?.name || session.user?.email}!</p>
                  <p>Roles: {getUserRoles().join(', ') || 'No roles assigned'}</p>
                  <p>Permissions: {getUserPermissions().length} permissions assigned</p>
                  <button
                    onClick={() => signOut()}
                    className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div>
                  <p>You are not signed in.</p>
                  <button
                    onClick={() => signIn()}
                    className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Section */}
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Available Pages
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              
              {/* Public Pages */}
              <Link href="/dashboard" className="block p-4 border rounded-lg hover:bg-gray-50">
                <h4 className="font-medium text-blue-600">Dashboard</h4>
                <p className="text-sm text-gray-500">Requires authentication</p>
              </Link>

              {/* Agent Pages */}
              <WithAgentRole fallback={
                <div className="block p-4 border rounded-lg bg-gray-100">
                  <h4 className="font-medium text-gray-400">Agent Panel</h4>
                  <p className="text-sm text-gray-400">Agent role required</p>
                </div>
              }>
                <Link href="/agent" className="block p-4 border rounded-lg hover:bg-gray-50">
                  <h4 className="font-medium text-green-600">Agent Panel</h4>
                  <p className="text-sm text-gray-500">Agent dashboard</p>
                </Link>
              </WithAgentRole>

              {/* Admin Pages */}
              <WithAdminRole fallback={
                <div className="block p-4 border rounded-lg bg-gray-100">
                  <h4 className="font-medium text-gray-400">Admin Panel</h4>
                  <p className="text-sm text-gray-400">Administrator role required</p>
                </div>
              }>
                <Link href="/admin" className="block p-4 border rounded-lg hover:bg-gray-50">
                  <h4 className="font-medium text-red-600">Admin Panel</h4>
                  <p className="text-sm text-gray-500">Administrator dashboard</p>
                </Link>
              </WithAdminRole>

            </div>
          </div>

          {/* Role Information */}
          <WithAuth>
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Your Permissions
              </h3>
              <div className="mt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="font-medium text-gray-900">Roles</h4>
                    <ul className="mt-2 text-sm text-gray-600">
                      {getUserRoles().map(role => (
                        <li key={role} className="capitalize">• {role}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Quick Access</h4>
                    <div className="mt-2 space-y-1">
                      {isAdmin() && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Administrator
                        </span>
                      )}
                      {isAgent() && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Agent
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </WithAuth>
        </div>
      </div>
    </div>
  )
}
