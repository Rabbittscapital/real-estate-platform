"use client"

import { useSession } from "next-auth/react"
import { Header } from "@/components/header"

export default function Home() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Welcome to Real Estate Platform
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Your trusted partner in finding the perfect property
          </p>
        </div>

        <div className="mt-16">
          {status === "loading" && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          )}

          {status === "authenticated" && session && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome back, {session.user?.name}!
              </h2>
              <p className="text-gray-600 mb-4">
                You are successfully authenticated with {session.user?.email}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Browse Properties
                  </h3>
                  <p className="text-blue-700">
                    Explore our extensive collection of properties available for rent and sale.
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    List Your Property
                  </h3>
                  <p className="text-green-700">
                    List your property with us and reach thousands of potential buyers and renters.
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">
                    Get Expert Advice
                  </h3>
                  <p className="text-purple-700">
                    Connect with our real estate experts for personalized guidance and support.
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === "unauthenticated" && (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Get Started Today
              </h2>
              <p className="text-gray-600 mb-6">
                Sign in to access all features of our real estate platform, including property listings, 
                advanced search filters, and personalized recommendations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    For Buyers & Renters
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Search thousands of properties</li>
                    <li>• Save your favorite listings</li>
                    <li>• Get instant notifications</li>
                    <li>• Connect with agents</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    For Property Owners
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• List properties for free</li>
                    <li>• Manage inquiries easily</li>
                    <li>• Track property performance</li>
                    <li>• Reach verified buyers</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
