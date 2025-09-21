'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { WithAdminRole, WithPermission } from '@/components/auth/ProtectedComponents'
import { PERMISSIONS } from '@/lib/permissions'

export default function AdminDashboard() {
  const { data: session } = useSession()

  return (
    <WithAdminRole>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Administrator Dashboard
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Welcome, {session?.user?.name}! You have administrator privileges.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* User Management */}
            <WithPermission permission={PERMISSIONS.USER_READ}>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          User Management
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Manage System Users
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-cyan-700 hover:text-cyan-900 cursor-pointer">
                      View all users
                    </span>
                  </div>
                </div>
              </div>
            </WithPermission>

            {/* Role Management */}
            <WithPermission permission={PERMISSIONS.ROLE_READ}>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Role & Permissions
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Manage Access Control
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-cyan-700 hover:text-cyan-900 cursor-pointer">
                      Manage roles
                    </span>
                  </div>
                </div>
              </div>
            </WithPermission>

            {/* Reports */}
            <WithPermission permission={PERMISSIONS.REPORT_ADMIN}>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Admin Reports
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          System Analytics
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-cyan-700 hover:text-cyan-900 cursor-pointer">
                      View reports
                    </span>
                  </div>
                </div>
              </div>
            </WithPermission>

          </div>

          <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Administrator Privileges
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>As an administrator, you have access to:</p>
                <ul className="mt-2 list-disc list-inside">
                  <li>Full user management capabilities</li>
                  <li>Role and permission configuration</li>
                  <li>System-wide reports and analytics</li>
                  <li>All project and property management features</li>
                </ul>
              </div>
              <div className="mt-5">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WithAdminRole>
  )
}