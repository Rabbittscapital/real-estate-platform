'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { WithAgentRole, WithPermission } from '@/components/auth/ProtectedComponents'
import { PERMISSIONS } from '@/lib/permissions'

export default function AgentDashboard() {
  const { data: session } = useSession()

  return (
    <WithAgentRole>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Agent Dashboard
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Welcome, {session?.user?.name}! Manage your properties and projects.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Property Management */}
            <WithPermission permission={PERMISSIONS.PROPERTY_READ}>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Property Management
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Manage Listings
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-cyan-700 hover:text-cyan-900 cursor-pointer">
                      View properties
                    </span>
                  </div>
                </div>
              </div>
            </WithPermission>

            {/* Project Management */}
            <WithPermission permission={PERMISSIONS.PROJECT_READ}>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Project Management
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Manage Projects
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-cyan-700 hover:text-cyan-900 cursor-pointer">
                      View projects
                    </span>
                  </div>
                </div>
              </div>
            </WithPermission>

            {/* Sales Reports */}
            <WithPermission permission={PERMISSIONS.REPORT_SALES}>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Sales Reports
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          Track Performance
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
                Agent Capabilities
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>As an agent, you can:</p>
                <ul className="mt-2 list-disc list-inside">
                  <li>Create, edit, and manage property listings</li>
                  <li>Manage real estate projects</li>
                  <li>Access sales and analytics reports</li>
                  <li>View client information</li>
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
    </WithAgentRole>
  )
}