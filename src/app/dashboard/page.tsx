'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { WithAuth } from '@/components/auth/ProtectedComponents'

export default function Dashboard() {
  const { data: session } = useSession()

  return (
    <WithAuth>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Welcome to your dashboard, {session?.user?.name}!
            </p>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Protected Content
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>This page requires authentication to access.</p>
                <p className="mt-2">
                  User ID: {session?.user?.id}<br />
                  Email: {session?.user?.email}<br />
                  Roles: {session?.user?.roles?.map(r => r.name).join(', ')}
                </p>
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
    </WithAuth>
  )
}